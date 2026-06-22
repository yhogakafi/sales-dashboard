import * as XLSX from 'xlsx'
import { formatDateLabel, dayName } from './parseData'

export function exportToExcel(data) {
  const wb = XLSX.utils.book_new()
  const customers = data.rankedCustomers

  // --- Sheet: Ringkasan ---
  const ringkasanRows = [
    ['Laporan Penjualan Harian per Pelanggan Penagihan'],
    [`Periode: ${data.periodLabel}`],
    [],
    ['Total omset', data.totalOmset, '', 'Total order', data.totalOrder],
    ['Jumlah pelanggan', customers.length, '', 'Hari aktif', data.dateKeys.length],
    [],
    ['#', 'Pelanggan Penagihan', 'Total Omset', 'Total Order', 'AOV', '% dari Total Omset'],
  ]
  customers.forEach((c, i) => {
    const omset = data.customerTotals[c]
    const order = data.customerCounts[c]
    ringkasanRows.push([
      i + 1,
      c,
      omset,
      order,
      order > 0 ? omset / order : 0,
      omset / data.totalOmset,
    ])
  })
  ringkasanRows.push([
    '',
    'Total',
    data.totalOmset,
    data.totalOrder,
    data.totalOmset / data.totalOrder,
    1,
  ])
  const wsRingkasan = XLSX.utils.aoa_to_sheet(ringkasanRows)
  XLSX.utils.book_append_sheet(wb, wsRingkasan, 'Ringkasan')

  // --- Sheet builder for pivots ---
  function buildPivotSheet(pivot, title) {
    const header = ['Tanggal', ...customers, 'TOTAL']
    const aoa = [[title], [], header]
    for (const d of data.dateKeys) {
      const row = [`${formatDateLabel(d)} (${dayName(d, true)})`]
      let rowTotal = 0
      for (const c of customers) {
        const v = pivot[d][c]
        row.push(v)
        rowTotal += v
      }
      row.push(rowTotal)
      aoa.push(row)
    }
    const totalRow = ['TOTAL']
    let grand = 0
    for (const c of customers) {
      const colSum = data.dateKeys.reduce((s, d) => s + pivot[d][c], 0)
      totalRow.push(colSum)
      grand += colSum
    }
    totalRow.push(grand)
    aoa.push(totalRow)
    return XLSX.utils.aoa_to_sheet(aoa)
  }

  XLSX.utils.book_append_sheet(wb, buildPivotSheet(data.pivotOmset, 'Omset Harian per Pelanggan Penagihan (Rp)'), 'Omset Harian')
  XLSX.utils.book_append_sheet(wb, buildPivotSheet(data.pivotCount, 'Jumlah Order Harian per Pelanggan Penagihan'), 'Jumlah Order Harian')

  XLSX.writeFile(wb, 'Laporan_Penjualan_Harian_per_Pelanggan_Penagihan.xlsx')
}
