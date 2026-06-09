import { Record } from "@/app/schemas/record.schema";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

// Display the records in a simplified way
interface Props {
  records: Record[] | null;
  title: string;
}
const RecordsOverView = ({ records, title }: Props) => {
  const rows = records?.map((record) => {
    return {
      name: record.name,
      numberOfColumns: record.records.length,
    };
  });
  console.log(rows);

  return (
    <div>
      <Typography sx={{ textAlign: "center", mb: 1 }} variant="h5">
        {title}
      </Typography>
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="records-overview">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Records Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.numberOfColumns}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default RecordsOverView;
