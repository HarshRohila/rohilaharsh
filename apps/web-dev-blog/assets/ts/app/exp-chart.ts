// @ts-expect-error
const Chart = window.Chart

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  return {
    text: isDark ? '#c8c2b8' : '#333333',
    grid: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)'
  }
}

function applyChartTheme(chart: any) {
  const colors = getChartColors()
  Chart.defaults.color = colors.text
  chart.options.scales.x.grid.color = colors.grid
  chart.options.scales.x.border.color = colors.grid
  chart.options.scales.x.ticks.color = colors.text
  chart.options.scales.x.title.color = colors.text
  chart.options.scales.y.grid.color = colors.grid
  chart.options.scales.y.border.color = colors.grid
  chart.options.scales.y.ticks.color = colors.text
  chart.options.plugins.legend.labels.color = colors.text
  chart.update()
}

;(async function () {
  const myData = [
    { category: 'Language', label: 'JavaScript', value: 1, color: '#F1E05A' },
    { category: 'Language', label: 'TypeScript', value: 6, color: '#3178C6' },
    { category: 'Front-End', label: 'Ember.js', value: 2, color: '#D95941' },
    { category: 'Front-End', label: 'React.js', value: 1.5, color: '#149ECA' },
    { category: 'Front-End', label: 'Stencil.js', value: 1.5, color: '#4C48FF' },
    { category: 'Back-End', label: 'Serverless Framework', value: 1.5, color: '#CA4640' },
    { category: 'Back-End', label: 'Nest.js', value: 1.5, color: '#EA2844' },
    { category: 'Cloud', label: 'AWS', value: 4, color: '#EC7211' },
    { category: 'Dev-Ops', label: 'Jenkins', value: 1, color: '#335061' },
    { category: 'Dev-Ops', label: 'AWS Codepipeline', value: 1, color: '#FF9900' },
    { category: 'Dev-Ops', label: 'Azure Pipelines', value: 0.5, color: '#0077D7' },
    { category: 'API Deployment', label: 'AWS Lambda', value: 1, color: '#EC7211' },
    { category: 'API Deployment', label: 'Kubernetes', value: 1, color: '#3069DE' },
    { category: 'Mobile Apps', label: 'Cordova', value: 1, color: '#2C7185' }
  ]

  const categories = [...new Set(myData.map(d => d.category))]
  const colors = getChartColors()

  const chart = new Chart(document.getElementById('exp-chart'), {
    type: 'bar',
    options: {
      indexAxis: 'y',
      aspectRatio: 0.8,
      scales: {
        x: {
          stacked: true,
          position: 'top',
          title: {
            display: true,
            text: 'Years of Experience',
            color: colors.text
          },
          ticks: { color: colors.text },
          grid: { color: colors.grid },
          border: { color: colors.grid }
        },
        y: {
          stacked: true,
          ticks: { color: colors.text },
          grid: { color: colors.grid },
          border: { color: colors.grid }
        }
      },
      plugins: {
        legend: {
          labels: { color: colors.text }
        }
      }
    },
    data: {
      labels: categories,
      datasets: [
        ...myData.map(row => {
          return {
            label: row.label,
            backgroundColor: row.color,
            data: categories.map(cat => {
              if (cat === row.category) {
                return row.value
              }
              return 0
            })
          }
        })
      ]
    }
  })

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        applyChartTheme(chart)
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true })
})()
