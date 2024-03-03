// @ts-expect-error
const Chart = window.Chart

;(async function () {
  const data = [
    { type: 'Front-End', count: 10 },
    { type: 'Back-End', count: 20 },
    { type: 'Dev Ops', count: 15 }
  ]

  const myData = [
    { category: 'Language', label: 'JavaScript', value: 1, color: '#F1E05A' },
    { category: 'Language', label: 'TypeScript', value: 4, color: '#3178C6' },
    { category: 'Front-End', label: 'Ember.js', value: 2, color: '#D95941' },
    { category: 'Front-End', label: 'React.js', value: 0.5, color: '#149ECA' },
    { category: 'Front-End', label: 'Stencil.js', value: 1.5, color: '#4C48FF' },
    { category: 'Back-End', label: 'Serverless Framework', value: 1, color: '#CA4640' },
    { category: 'Back-End', label: 'Nest.js', value: 1, color: '#EA2844' },
    { category: 'Cloud', label: 'AWS', value: 4, color: '#EC7211' },
    { category: 'Dev-Ops', label: 'Jenkins', value: 1, color: '#335061' },
    { category: 'Dev-Ops', label: 'AWS Codepipeline', value: 1, color: '#FF9900' },
    { category: 'Dev-Ops', label: 'Azure Pipelines', value: 0.5, color: '#0077D7' },
    { category: 'API Deployment', label: 'AWS Lambda', value: 1, color: '#EC7211' },
    { category: 'API Deployment', label: 'Kubernetes', value: 1, color: '#3069DE' },
    { category: 'Mobile Apps', label: 'Cordova', value: 1, color: '#2C7185' }
  ]

  const categories = [...new Set(myData.map(d => d.category))]

  new Chart(document.getElementById('exp-chart'), {
    type: 'bar',
    options: {
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Years of Experience'
          }
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
})()
