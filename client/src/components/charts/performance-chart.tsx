import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";

interface PerformanceData {
  subject: string;
  percentage: number;
  color: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-800">Desempenho por disciplina</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveBar
            data={data}
            keys={["percentage"]}
            indexBy="subject"
            margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            colors={({ data }) => data.color}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Acertos (%)",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </CardContent>
    </Card>
  );
}
