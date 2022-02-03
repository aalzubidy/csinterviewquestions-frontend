import { useEffect, useRef, useState, useContext } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { AlertsContext } from '../../../Contexts/AlertsContext';
import API from '../../../API';
import './PieChart.scss';

const PieChart = (props) => {
  // Settings
  let isMounted = useRef(false);
  const { alertMsg } = useContext(AlertsContext);
  const genericError = 'PieChart - Uknown error, check console logs for details';

  // Specific
  const { statType } = props;
  const [displayData, setDisplayData] = useState([]);

  // Update data keys from position/company,count to id/value
  const updateDataKeys = (oldData) => {
    return oldData.map((item) => {
      return {
        id: statType === 'positions' ? item.position : item.company,
        value: parseInt(item.count, 10) || 0
      }
    })
  }

  // Get positions or companies stats
  const getStats = async () => {
    try {
      if (statType === 'positions') {
        const { data } = await API.system.getStatsPositions('');
        if (data && isMounted) setDisplayData(updateDataKeys(data));
      } else if (statType === 'companies') {
        const { data } = await API.system.getStatsCompanies('');
        if (data && isMounted) setDisplayData(updateDataKeys(data));
      }
    } catch (error) {
      alertMsg('error', 'could not get stats positions', error.message || genericError, error);
    }
  };

  // Return pie chart center information
  const CenteredMetric = ({ centerX, centerY }) => {
    // let total = 0
    // dataWithArc.forEach(datum => {
    //   total += datum.value
    // })
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '18px',
        }}
      >
        {statType === 'positions' ? 'Positions' : 'Companies'} Posts
      </text>
    )
  }

  useEffect(() => {
    isMounted = true;

    if (statType && (!displayData || displayData.length <= 0)) getStats();

    return () => isMounted = false;
  }, [statType, displayData])

  return (
    <div className='PieChartDiv'>
      {displayData && displayData.length > 0 ? <span>
        <ResponsivePie
          data={displayData}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.8}
          activeInnerRadiusOffset={8}
          layers={['arcs', CenteredMetric]}
          padAngle={0.8}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [
              [
                'darker',
                0.2
              ]
            ]
          }}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          sortByValue
          startAngle={-6}

        // arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
        // arcLinkLabelsSkipAngle={10}
        // arcLinkLabelsTextColor="#333333"
        // arcLabelsSkipAngle={10}
        // arcLabelsTextColor={{
        //   from: 'color',
        //   modifiers: [
        //     [
        //       'darker',
        //       2
        //     ]
        //   ]
        // }}

        // defs={[
        //   {
        //     id: 'dots',
        //     type: 'patternDots',
        //     background: 'inherit',
        //     color: 'rgba(255, 255, 255, 0.3)',
        //     size: 4,
        //     padding: 1,
        //     stagger: true
        //   },
        //   {
        //     id: 'lines',
        //     type: 'patternLines',
        //     background: 'inherit',
        //     color: 'rgba(255, 255, 255, 0.3)',
        //     rotation: -45,
        //     lineWidth: 6,
        //     spacing: 10
        //   }
        // ]}

        // fill={[
        //   {
        //     match: {
        //       id: 'ruby'
        //     },
        //     id: 'dots'
        //   },
        //   {
        //     match: {
        //       id: 'c'
        //     },
        //     id: 'dots'
        //   },
        //   {
        //     match: {
        //       id: 'go'
        //     },
        //     id: 'dots'
        //   },
        //   {
        //     match: {
        //       id: 'python'
        //     },
        //     id: 'dots'
        //   },
        //   {
        //     match: {
        //       id: 'scala'
        //     },
        //     id: 'lines'
        //   },
        //   {
        //     match: {
        //       id: 'lisp'
        //     },
        //     id: 'lines'
        //   },
        //   {
        //     match: {
        //       id: 'elixir'
        //     },
        //     id: 'lines'
        //   },
        //   {
        //     match: {
        //       id: 'javascript'
        //     },
        //     id: 'lines'
        //   }
        // ]}

        // legends={[
        //   {
        //     anchor: 'bottom',
        //     direction: 'row',
        //     justify: false,
        //     translateX: 0,
        //     translateY: 56,
        //     itemsSpacing: 0,
        //     itemWidth: 100,
        //     itemHeight: 18,
        //     itemTextColor: '#999',
        //     itemDirection: 'left-to-right',
        //     itemOpacity: 1,
        //     symbolSize: 18,
        //     symbolShape: 'circle',
        //     effects: [
        //       {
        //         on: 'hover',
        //         style: {
        //           itemTextColor: '#000'
        //         }
        //       }
        //     ]
        //   }
        // ]}
        />
      </span> : ''}
    </div>
  )
}

export default PieChart;
