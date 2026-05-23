import type { AppTableColumn } from '@/modules/shared/components/app-data-table/AppDataTable.type'

export const CONTAINER_COLUMNS: AppTableColumn[] = [
  { field: 'location',       header: 'Location',        width: '130px', frozen: true, sortable: true },
  { field: 'type',           header: 'Type',            width: '80px',  sortable: true },
  { field: 'capacity',       header: 'Cap.',            width: '90px',  sortable: true, align: 'right' },
  { field: 'lastInspection', header: 'Last Inspection', width: '130px', sortable: true },
  { field: 'notes',          header: 'Notes',           minWidth: '200px', truncate: true },
  { field: 'assignedTeam',   header: 'Assigned Team',   width: '120px' },
  { field: 'temperature',    header: 'Temperature',     width: '120px', align: 'right', unit: '°C' },
  { field: 'humidity',       header: 'Humidity',        width: '100px', align: 'right', unit: '%' },
  { field: 'pressure',       header: 'Pressure',        width: '100px', align: 'right', unit: ' hPa' },
  { field: 'contract',       header: 'Contract',        width: '130px', filterable: true, filterOptions: [] },
  { field: 'owner',          header: 'Owner',           width: '120px', filterable: true, filterOptions: [] },
  {
    field: 'status',
    header: 'Status',
    width: '140px',
    filterable: true,
    filterOptions: [
      { label: 'Active',         value: 'Active' },
      { label: 'Expired',        value: 'Expired' },
      { label: 'Pending Review', value: 'PendingReview' },
    ],
  },
]
