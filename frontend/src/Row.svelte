<script lang="ts">
  import { UpdateStock }  from '../wailsjs/go/main/App'

  import type { Medication } from './Medication.svelte'

  export let value: Medication; // TODO figure out Medication type

  export let selected: string;

  const addStock = (name: string, med_name: string, new_stock: number) => {
    UpdateStock(name, med_name, new_stock, new Date().toDateString());  

    value.last_updated = new Date().toDateString();
  }
  
  const expiryDate = (med: any) => {
    let date: Date = new Date();
    date.setDate(date.getDate() + daysLeft(med));
    return date.toDateString();
  }

  const stockToday = (med) => {
    let days: number = Math.round((new Date().getTime() - new Date(med.last_updated).getTime()) / (1000 * 60 * 60 * 24));
    return med.stock - (days * med.dosage);
  }

  const daysLeft = (med) => {
    if (med.dosage > 0) {
      let stock_today: number = stockToday(med);
      return Math.round(stock_today / med.dosage);
    } else {
      return 0;
    }
  }

  const toFloat = (value: string) => {
    if (value === "" || value === null || value === undefined) { return 0.0; }
    return parseFloat(value);
  }

</script>

<tr>
    <td>{value.name}</td>
    <td>{value.amount} {value.unit}</td>
    <td>{value.dosage}</td>
    <td>
      <input type="number" step="0.5" on:change={() => addStock(selected, value.name, value.stock)} bind:value={value.stock}/>
    </td>
    <td>
      <small><i contenteditable="false" bind:innerHTML={value.last_updated}>{value.last_updated}</i></small>
    </td>
    <td class="spacer">
      <slot></slot>
    </td>
    
    <td>{stockToday(value)}</td>
    <td>{daysLeft(value)}</td>
    <td>{expiryDate(value)}</td>
  </tr>

  <style>
    td {
        padding: 10px;
        border: 1px solid grey;
        text-align: left;
        vertical-align: top;
    }

  .spacer {
    display: inline-flex;
    border: none;
    background-color: inherit;
  }

  td input {
    display: inline-flex;
    color: white;
    cursor: text;
    border: 1px solid lightblue; 
    padding: 3px;
    width: 40px;
    font-size: 0.8em;
    justify-content: right;
    background-color: #212121;
  }



  </style>