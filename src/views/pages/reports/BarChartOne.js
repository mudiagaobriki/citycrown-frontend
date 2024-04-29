import React from 'react';
import { Button, Row, Col, Card, Table, InputGroup, Form, Modal } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';

const BarChartOne = ({ data }) => {
  // Transform data for ApexCharts

  const transformedData = data
    ?.reverse()
    ?.slice(0, 40)
    .map((item) => ({
      x: item.name,
      y: item.quantity,
    }));

  // ApexCharts options
  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: transformedData.map((item) => item.x),
    },
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Store Item Usage Analytics</Card.Title>
          <div className="bar-chart">
            <ReactApexChart options={options} series={[{ data: transformedData }]} type="bar" height={350} />
            {/* <Bar
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: 'Example Data',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            /> */}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BarChartOne;
