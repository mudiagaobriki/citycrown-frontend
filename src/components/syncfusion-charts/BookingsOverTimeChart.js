import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Legend, Tooltip, DataLabel, Category, DateTime } from '@syncfusion/ej2-react-charts';

const BookingsOverTimeChart = ({ data }) => {
    // Aggregate data: Count the number of bookings per bookingDate
    // const bookingsOverTimeData = data.reduce((acc, item) => {
    //     const date = item.bookingDate;
    //     if (!acc[date]) acc[date] = 0;
    //     // eslint-disable-next-line no-plusplus
    //     acc[date]++;
    //     return acc;
    // }, {});

    // Convert aggregated data to an array of objects for the chart
    const chartData = Object.entries(data).map(([date, count]) => ({
        date: new Date(date), // Convert date string to Date object
        bookings: count,
    }));

    return (
        <div>
            <h3>Number of Bookings Over Time</h3>
            <ChartComponent
                id="bookingsOverTimeChart"
                primaryXAxis={{
                    valueType: 'DateTime',
                    labelFormat: 'MMM dd, yyyy', // Format the date display
                }}
                primaryYAxis={{
                    title: 'Number of Bookings',
                }}
            >
                <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category, DateTime]} />
                <SeriesCollectionDirective>
                    <SeriesDirective
                        dataSource={chartData}
                        xName="date"
                        yName="bookings"
                        type="Line"
                        name="Bookings"
                        marker={{ visible: true }}
                    />
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    );
};

export default BookingsOverTimeChart;