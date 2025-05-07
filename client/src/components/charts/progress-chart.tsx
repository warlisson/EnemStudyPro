import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";

interface ProgressData {
  id: string;
  color: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-800">Progresso semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ 
              type: "linear", 
              min: 0, 
              max: "auto", 
              stacked: false, 
              reverse: false 
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Semana",
              legendOffset: 36,
              legendPosition: "middle"
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Acertos (%)",
              legendOffset: -50,
              legendPosition: "middle"
            }}
            colors={{ datum: "color" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
