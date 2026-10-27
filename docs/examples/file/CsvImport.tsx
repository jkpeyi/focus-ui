import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  DataTable,
  FileDropzone,
  FileList,
  useToast,
} from '@jkpeyi/focus-ui';
import { FileSpreadsheet } from 'lucide-react';

type Row = Record<string, string> & { _row: string };

/** Minimal CSV parser for the demo (no quoted commas). Use papaparse in production. */
function parseCsv(text: string) {
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const headers = head.split(',').map((h) => h.trim());
  const rows: Row[] = lines.map((line, i) => {
    const cells = line.split(',');
    return Object.fromEntries([...headers.map((h, j) => [h, (cells[j] ?? '').trim()]), ['_row', String(i + 1)]]) as Row;
  });
  return { headers, rows };
}

const SAMPLE = `sku,name,quantity,unit_cost
SKU-2400,Aluminium Housing A2,120,18.40
SKU-2407,Precision Bearing 608ZZ,800,1.25
SKU-2414,Industrial Sensor S9,45,212.00
SKU-2421,Control Board v4,60,96.50`;

export default function Example() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ReturnType<typeof parseCsv> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (f: File) => {
    setError(null);
    setFile(f);
    const parsed = parseCsv(await f.text());
    if (!parsed.headers.includes('sku')) {
      setData(null);
      return setError('The file needs a “sku” column. Download the template to get started.');
    }
    setData(parsed);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader
        title="Import stock levels"
        description="Update on-hand quantities from a CSV export."
        actions={
          <Button size="sm" variant="plain" onClick={() => load(new File([SAMPLE], 'stock-sample.csv', { type: 'text/csv' }))}>
            Use sample file
          </Button>
        }
      />
      <CardContent className="space-y-3">
        {!file ? (
          <FileDropzone
            accept=".csv,text/csv"
            multiple={false}
            maxSize={5 * 1024 * 1024}
            icon={<FileSpreadsheet />}
            title={
              <>
                Drop your CSV here or <span className="text-accent">browse</span>
              </>
            }
            onFilesAdded={([f]) => load(f)}
            onReject={([r]) => setError(r.message)}
          />
        ) : (
          <FileList
            items={[{ id: 'csv', name: file.name, size: file.size, type: 'text/csv', status: error ? 'error' : 'done', error }]}
            onRemove={() => {
              setFile(null);
              setData(null);
              setError(null);
            }}
          />
        )}
        {error && !file && <Alert tone="danger">{error}</Alert>}
        {data && (
          <>
            <p className="text-[13px] text-fg-muted">
              {data.rows.length} rows · {data.headers.length} columns — preview:
            </p>
            <DataTable
              density="compact"
              data={data.rows.slice(0, 5)}
              rowKey="_row"
              columns={data.headers.map((h) => ({ id: h, header: h, align: /quantity|cost|price/.test(h) ? 'right' : 'left' }))}
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          disabled={!data}
          onClick={() => toast({ title: `${data?.rows.length} stock levels updated`, tone: 'success' })}
        >
          Import {data ? `${data.rows.length} rows` : ''}
        </Button>
      </CardFooter>
    </Card>
  );
}
