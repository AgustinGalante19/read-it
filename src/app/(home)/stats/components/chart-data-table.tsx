export default function ChartDataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className='sr-only'>
      <caption>{caption}</caption>
      <thead><tr>{columns.map((column) => <th scope='col' key={column}>{column}</th>)}</tr></thead>
      <tbody>
        {rows.map(([label, ...values], index) => (
          <tr key={`${label}-${index}`}>
            <th scope='row'>{label}</th>
            {values.map((value, valueIndex) => <td key={valueIndex}>{value}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
