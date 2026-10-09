export function SpecsTable({ specs }: { specs: { name: string; value: string }[] }) {
  return (
    <table className="mt-4 w-full text-sm">
      <tbody>
        {specs.map((s, i) => (
          <tr key={`${s.name}-${i}`} className="odd:bg-surface">
            <th scope="row" className="w-2/5 rounded-l-lg px-3 py-2.5 text-left font-medium text-muted">
              {s.name}
            </th>
            <td className="rounded-r-lg px-3 py-2.5">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
