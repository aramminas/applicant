import React, {Component} from 'react'
import CanvasJSReact from '../../../assets/canvasjs.react'
const CanvasJSChart = CanvasJSReact.CanvasJSChart

class Chart extends Component {
    constructor(props) {
        super(props)
        this.toggleDataSeries = this.toggleDataSeries.bind(this)
    }

    toggleDataSeries(e){
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible)
        this.chart.render()
    }

    render() {
        const {lang, chart} = this.props

        const chartData = [
            {
                type: "spline",
                name: lang.applicants,
                // axisYType: "secondary",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: `# ${lang.applicants_month}`,
                dataPoints: chart[0]
            },
            {
                type: "spline",
                name: lang.tests_,
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: `# ${lang.tests_month}`,
                dataPoints: chart[1]
            },
            {
                type: "spline",
                name: lang.passed_tests,
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: `# ${lang.passed_tests_month}`,
                dataPoints: chart[2]
            },
        ]

        const options = {
            theme: "light2",
            animationEnabled: true,
            title:{
                text: lang.applicant_and_test
            },
            subtitles: [{
                text: lang.hide_show_text
            }],
            axisX: {
                title: lang.states
            },
            axisY: {
                title: lang.applicants,
                titleFontColor: "#6D78AD",
                lineColor: "#6D78AD",
                labelFontColor: "#6D78AD",
                tickColor: "#6D78AD",
                includeZero: false
            },
            axisY2: {
                title: lang.tests_passed,
                titleFontColor: "#51CDA0",
                lineColor: "#51CDA0",
                labelFontColor: "#51CDA0",
                tickColor: "#51CDA0",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: this.toggleDataSeries
            },
            data: chartData
        }

        return (
            <div>
                <CanvasJSChart options = {options}
                               onRef={ref => this.chart = ref}
                />
            </div>
        )
    }
}

export default Chart