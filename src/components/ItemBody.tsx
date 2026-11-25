/** Renders the question part of an item: text, Python code, tables, context block (FR-07). */

export type TableData = { headers: string[]; rows: string[][] };

export type ItemBodyData = {
  text: string;
  code?: string;
  table?: TableData;
  context?: { title?: string; text?: string; table?: TableData };
  left?: { id: string; text: string }[];
};

export type OptionData = { id: string; text: string };

function DataTable({ table }: { table: TableData }) {
  return (
    <table className="data">
      <thead>
        <tr>
          {table.headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ItemBody({ body }: { body: ItemBodyData }) {
  return (
    <div>
      {body.context && (
        <div className="context-box">
          {body.context.title && <strong>{body.context.title}</strong>}
          {body.context.text && <p style={{ margin: "6px 0" }}>{body.context.text}</p>}
          {body.context.table && <DataTable table={body.context.table} />}
        </div>
      )}
      <p className="item-text">{body.text}</p>
      {body.code && <pre className="code">{body.code}</pre>}
      {body.table && <DataTable table={body.table} />}
    </div>
  );
}
