import { useState } from 'react';
import { Pagination } from 'focus-ui';

export default function Example() {
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(25);
  return (
    <Pagination
      className="w-full"
      page={page}
      pageSize={pageSize}
      total={1248}
      onPageChange={setPage}
      onPageSizeChange={(s) => {
        setPageSize(s);
        setPage(1);
      }}
    />
  );
}
