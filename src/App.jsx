import { useState, useCallback } from 'react'
import UploadZone from './UploadZone'
import SummaryCards from './SummaryCards'
import DailyTrendChart from './DailyTrendChart'
import BreakdownCharts from './BreakdownCharts'
import RankingTable from './RankingTable'
import PivotTable from './PivotTable'
import { parseWorkbook } from './parseData'
import { exportToExcel } from './exportExcel'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback((file) => {
    setError(null)
    setLoading(true)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = parseWorkbook(e.target.result)
        setData(result)
      } catch (err) {
        setError(err.message || 'Gagal membaca file.')
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    reader.onerror = () => {
      setError('Gagal membaca file dari komputer.')
      setLoading(false)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Dashboard penjualan</p>
          <h1>Analisa penjualan toko online</h1>
        </div>
        {data && (
          <button className="btn-export" onClick={() => exportToExcel(data)}>
            Unduh sebagai Excel
          </button>
        )}
      </header>

      <UploadZone onFile={handleFile} error={error} fileName={fileName} />

      {loading && <p className="loading-text">Memproses file…</p>}

      {data && (
        <main className="dashboard">
          <p className="period-note">Periode data: {data.periodLabel} ({data.dateKeys.length} hari aktif)</p>

          <SummaryCards data={data} />

          <section>
            <h2 className="section-title">Tren harian</h2>
            <DailyTrendChart daily={data.daily} />
          </section>

          <section>
            <h2 className="section-title">Komposisi omset</h2>
            <BreakdownCharts platformTotals={data.platformTotals} brandTotals={data.brandTotals} />
          </section>

          <section>
            <RankingTable data={data} />
          </section>

          <section>
            <PivotTable data={data} />
          </section>
        </main>
      )}

      <footer className="app-footer">
        <p>Semua pemrosesan berjalan di browser kamu — file tidak diunggah ke server mana pun.</p>
      </footer>
    </div>
  )
}
