<svelte:head>
  <script src="https://unpkg.com/focus-visible@latest/dist/focus-visible.min.js"></script>
  <!-- Roboto -->
  <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />
  <!-- Roboto Mono -->
  <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
  />
</svelte:head>

<script lang="ts">
  import { GetNames, Medications, Save }  from '../wailsjs/go/main/App'

  import { null_to_empty } from 'svelte/internal';
  import { fly, fade } from 'svelte/transition';

  import * as Icon from 'svelte-awesome-icons';

  import Row from './Row.svelte';
  import Confirm from './Confirm.svelte';
  import Dialog, { showDialog, closeDialog, ref } from "./Dialog.svelte";

  let not_saved: boolean = false;
  let message: string = "";
  let meds = [];
  let names: string[] = [];

  const displayMessage = (msg: string) => {
    message = msg;
    if (msg != "") { setTimeout(() => { message = ""; }, 5000); }
  } 

  displayMessage("Welcome to the Medication Overview page");
  
  const deleteMed = (med) => {
    meds = meds.filter(m => m.name != med.name);

    not_saved = true;
  }

  const saveMeds = (meds, selected) => {
    Save(meds, selected).then(() => {
      not_saved = false;
      displayMessage("Saved");
    });
  }  

  let selected: string;
  GetNames().then(ns => {
    names = ns;
    selected = ns[0]
    Medications(selected).then(ms => {
      meds = ms.sort((a,b) => a.name.localeCompare(b.name))
    });
  });

  const toFloat = (value) => {
    if (value === "" || value === null || value === undefined) { return 0.0; }
    return parseFloat(value);
  }

  const toInt = (value) => {
    if (value === "" || value === null || value === undefined) { return 0; }
    return parseInt(value);
  }

  const getValue = (id) => {
    let currentDialog: HTMLDialogElement = ref("add-dialog"); 
    return (<HTMLInputElement>currentDialog.querySelector(id)).value;
  }

  const handleSubmitAdd = () => {
    closeDialog("add-dialog");
    let currentDialog: HTMLDialogElement = ref("add-dialog"); 
    let med = {
      name:   getValue('#name'),
      amount: toFloat(getValue('#amount')),
      dosage: toFloat(getValue('#dosage')),
      stock:  toInt(getValue('#stock')),
      last_updated: new Date().toDateString(),
      unit: "mg"
    };
    meds.push(med);

    meds = meds;
  }

</script>

<main>
  <div class="container">
    <div class="top-bar">
      <div class="title">Medication Overview</div>
      <div class="selected">User: <span class="name">{selected}</span></div>
      <div class="message" contenteditable="false"  bind:innerHTML={message}>messages appear here</div>
    </div>
    <div class="content">
      {#if null_to_empty(meds).length == 0}
        <p>There are no medications for this name</p>
      {:else}
        <p>You can update the stock whenever you receive new medications<br/>
          The Stock Today, Days Left and Expiry Date are calculated from the day the stock got updated last.</p>
        <table>
            <tr><th>Name</th><th>Amount</th><th>Dosage</th><th>Stock</th><th>Last Updated</th><th class="spacer"></th><th>StockToday</th><th>Days Left</th><th>Expires</th></tr>
          {#each meds as med, i}
            <Row bind:value={med} selected={selected}>
              <span class="row-buttons">
                <Icon.PencilSolid size="20" color="#87cefa" />
                <Confirm confirmTitle="Delete" cancelTitle="Cancel" let:confirm="{confirmThis}">
                  <button on:click={() => confirmThis(deleteMed, med)}>
                    <Icon.TrashCanSolid size="20" color="#87cefa" />
                    </button> 
                  <span slot="title">
                    Delete this item?
                  </span>
                  <span slot="description">
                    You won't be able to revert this!
                  </span>
                </Confirm>
              </span>
            </Row>
          {/each}
          <tr>
            <td colspan="9">
              <div class="buttonrow">
                <button on:click={() => showDialog("add-dialog", true)}>
                  <Icon.PlusSolid  size="20" color="#87cefa" />
                </button>
                <button on:click={() => saveMeds(meds, selected)}>
                  <Icon.FloppyDiskSolid  size="20" color="#87cefa" />
                </button>
              </div>
            </td>
          </tr>
        </table>
      {/if}
    </div>
    </div>


  <Dialog name="add-dialog">
    <div
      class="overlay"
      in:fade="{{ duration: 200 }}"
      out:fade="{{ delay: 200, duration: 200 }}"
    ></div>
    <div class="dialog">
      <div class="header">
        <h3>Add new Medication</h3>
      </div>
      <form method="dialog" on:submit|preventDefault={handleSubmitAdd}>
        <div class="row">
          <label for="name">Name:</label><input type="text" id="name" placeholder="Name" />
        </div>
        <div class="row">
          <label for="stock">Stock:</label><input type="number" id="stock" placeholder="0" />
          <label for="amount">Amount:</label><input type="number" id="amount" placeholder="0" />
          <label for="dosage">Dosage:</label><input type="number" id="dosage" placeholder="0" />
        </div>
        <div class="buttonrow">
            <button type="submit" value="ok"><Icon.CheckSolid color="#87cefa"/></button>
            <button type="button" on:click={() => closeDialog("add-dialog")}><Icon.BanSolid color="#87cefa"/></button>
        </div>
      </form>
    </div>
  </Dialog>

</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    font-family: "Roboto Mono";
    font-size: 16px;
    justify-content: left;
    align-items: left;
    margin: 10px auto;
    margin-top: 0px;
  }

  .container .top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: grey;
    padding: 10px;
  }

  .container .top-bar .title {
    flex-direction: row;
    font-family: Geneva, Verdana, sans-serif;
    font-size: 1.2em;
    font-weight: bold;
    padding-left: 20px;
    text-align: left;
  }

  .container .top-bar .selected .name {
    font-weight: bold;
    font-size: 1.2em;
    padding-right: 20px;
    color: lightskyblue;
  }
  .container .top-bar .message {
    color: lightskyblue;
    width:500px;
    border: 1px solid black;
  }

  .container .content {
    flex-direction: column;
  }

  .container .buttonrow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 10px;
    padding-right: 20px;
  }

  .container .content .buttonrow button {
    margin-left: 10px;
  }

  .container button {
    background-color: #212121;
    border: none;
    cursor: pointer;
  }

  .content table {
    border-collapse: collapse;
    border-spacing: 0;
    margin-left: 20px;
  }

  .content table .buttonrow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
  }

  .content table th {
    padding: 10px;
    border: none;
    text-align: left;
    vertical-align: top;
    background-color: grey;
  }

  .content p {
    text-align: left;
    margin: 10px;
    margin-left: 20px;
    font-size: smaller;
  }

  .dialog .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .dialog .header button {
    position: absolute;
    right: -2px;
    top: 0px;
  }
      
  .dialog .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  .dialog .buttonrow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px;
    width:100%;
  }

  .dialog input {
    display: inline-flex;
    color: lightskyblue;
    cursor: text;
    border: 1px solid lightskyblue;
    padding: 3px;
    width: 40px;
    font-size: 0.8em;
    justify-content: right;
    background-color: #212121;
    margin-right: 10px;
  }

  .dialog input#name {
    width: 200px;
  }
  .dialog h3 {
    margin-top: 0px;
  }

  .dialog button {
    background-color: black;
    border: none;
    cursor: pointer;
  }
</style>
