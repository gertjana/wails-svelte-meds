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
  import { GetMedications, Save, GetUser, AddUser, GetUsers, SetUser, UpdateStock, MarkUnsaved, DeleteMed }  from '../wailsjs/go/main/App'
  import type { Medication } from './Medication.svelte'
  import { stockToday, expiryDate, daysLeft } from './Medication.svelte';

  import { null_to_empty } from 'svelte/internal';

  import * as Icon from 'svelte-awesome-icons';

  import Dialog, { showDialog, closeDialog, clearForm, ref } from "./Dialog.svelte";

  let meds: Medication[] = [];

  // helper functions
  let unsaved: boolean = false;
  const markUnsaved = (u: boolean) => {
    MarkUnsaved(u);
    unsaved = u
  }
  
  let message: string = "";
  const displayMessage = (msg: string) => {
    message = msg;
    if (msg != "") { setTimeout(() => { message = ""; }, 5000); }
  } 

  const toFloat = (value) => {
    if (value === "" || value === null || value === undefined) { return 0.0; }
    return parseFloat(value);
  }

  const findIndexByProperty = (data: any[], key: string, value: any) => {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] == value) {
            return i;
        }
    }
    return -1;
}


  let users: string[] = [];
  GetUsers().then(us => {
    users = us;
  });

  // main entry point
  let currentUser: string;
  GetUser().then(user => {
    currentUser = user
    GetMedications().then(ms => {
      meds = ms
    });
  });

  displayMessage("Welcome to the Medication Overview page");


  // CRUD for med's
  const addMed = () => {
    clearForm("medication-dialog");
    showDialog("medication-dialog", true);
  }

  const editMed = (med: Medication) => {
    showDialog("medication-dialog", true);
    let currentDialog: HTMLDialogElement = ref("medication-dialog"); 
    (<HTMLHeadingElement>currentDialog.querySelector("h3")).innerText = "Edit Medication";
    (<HTMLInputElement>currentDialog.querySelector("#name")).value = med.name;
    (<HTMLInputElement>currentDialog.querySelector("#amount")).value =  med.amount.toString();
    (<HTMLInputElement>currentDialog.querySelector("#dosage")).value = med.dosage.toString();
    (<HTMLInputElement>currentDialog.querySelector("#stock")).value = med.stock.toString();
  } 

  const saveMeds = (meds: Medication[]) => {
    Save(meds).then(() => {
      markUnsaved(false);
      displayMessage("Saved");
    });
  }  

  const deleteMedDialog = (med: Medication) => {
    let currentDialog: HTMLDialogElement = ref("delete-dialog"); 
    (<HTMLSpanElement>currentDialog.querySelector("#name")).innerText = med.name;
    (<HTMLInputElement>currentDialog.querySelector("#name")).value = med.name;
    showDialog("delete-dialog", true);
  }

  const addStock = (med: Medication) => {
    showDialog("add-stock-dialog", true);
  }

  const updateStock = (med: Medication) => {
    UpdateStock(med.name, med.stock, new Date().toDateString());  

    // meds = meds

    markUnsaved(true);
  }

  // crud for users
  const addUser = () => {
    showDialog("user-dialog", true);
  }

  const setUser = (e) => {
    console.log(e.target.value);
    SetUser(e.target.value).then(() => {
      currentUser = e.target.value;
      GetMedications().then(ms => {
        meds = ms
      });
    })
  }

// form submits
  const handleSubmit = (d: string) => {
    closeDialog(d);
    let currentDialog: HTMLDialogElement = ref(d); 
    let med = {
      name:   (<HTMLInputElement>currentDialog.querySelector('#name')).value,
      amount: toFloat((<HTMLInputElement>currentDialog.querySelector('#amount')).value),
      dosage: toFloat((<HTMLInputElement>currentDialog.querySelector('#dosage')).value),
      stock:  toFloat((<HTMLInputElement>currentDialog.querySelector('#stock')).value),
      last_updated: new Date().toDateString(),
      unit: "mg"
    };

    let i: number = findIndexByProperty(meds, "name", med.name);
    if (i >= 0) { meds[i] = med; } 
    else { meds.push(med); }

    markUnsaved(true);

    //trigger binding
    meds = meds;
  }

  const handleSubmitUser = (d: string) => {
    closeDialog(d);
    let currentDialog: HTMLDialogElement = ref(d); 
    let user = (<HTMLInputElement>currentDialog.querySelector('#user')).value;
    AddUser(user).then(() => {
      GetUsers().then(us => {
        users = us;
      });
      currentUser = user;
      GetMedications().then(ms => {
        meds = ms.sort((a,b) => a.name.localeCompare(b.name))
      });
    })
  }

  const handleSubmitDelete = (d: string) => {
    closeDialog(d);
    let currentDialog: HTMLDialogElement = ref(d); 
    let name = (<HTMLInputElement>currentDialog.querySelector('#name')).value;
    
    meds = meds.filter(m => m.name != name);

    DeleteMed(name).then(() => {
      displayMessage("Deleted "+name);
    });
    markUnsaved(true);
  }

  const handleSubmitAddStock = (d: string) => {
    closeDialog(d);
    let currentDialog: HTMLDialogElement = ref(d); 
    let stock = toFloat((<HTMLInputElement>currentDialog.querySelector('#stock')).value);
    let name = (<HTMLInputElement>currentDialog.querySelector('#name')).value;
     let i: number = findIndexByProperty(meds, "name", name);
    if (i >= 0) { meds[i].stock += stock; } 

    meds = meds;

    markUnsaved(true);
  }
</script>

<main>
  <div class="container">
    <div class="top-bar">
      <div class="title">Medication Overview</div>
      <div class="modified">
        {#if unsaved}<Icon.StarOfLifeSolid size="10"/>{/if}</div>
      <div class="selected">
        User:&nbsp;
        <select bind:value={currentUser} on:change={(e) => setUser(e)}>
          {#each users as user, i}
            <option value={user}>{user}</option>
          {/each}
        </select>
        <button on:click={addUser}><Icon.PlusSolid size=15 color="#87cefa" /></button>
      </div>
      <div class="message" contenteditable="false"  bind:innerHTML={message}>messages appear here</div>
    </div>
    <div class="content">
      {#if null_to_empty(meds).length === 0 && null_to_empty(currentUser) === ""}
        <p>There are no medications for this name</p>
      {:else}
        <p>You can update the stock whenever you receive new medications<br/>
          The Stock Today, Days Left and Expiry Date are calculated from the day the stock got updated last.</p>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Amount</th><th>Dosage</th><th>Stock</th><th>Last Updated</th><th></th><th>StockToday</th><th>Days Left</th><th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {#each meds as med (med.name)}
            <tr>
              <td>{med.name}</td>
              <td>{med.amount} {med.unit}</td>
              <td>{med.dosage}</td>
              <td>
                <input type="number" step="0.5" on:change={() => updateStock(med)} bind:value={med.stock}/>
              </td>
              <td>
                <small><i contenteditable="false" bind:innerHTML={med.last_updated}>{med.last_updated}</i></small>
              </td>
              <td class="spacer">
                <span class="row-buttons">
                  <button class="tags" data-tooltip="Add stock (adds to current)" on:click={() => addStock(med)}>
                    <Icon.PlusSolid size="20" color="#87cefa" />
                  </button>
                  <button class="tags" data-tooltip="Edit medication" on:click={() => editMed(med)}>
                    <Icon.PencilSolid size="20" color="#87cefa" />
                  </button>
                  <button class="tags" data-tooltip="Delete medication" on:click={() => deleteMedDialog(med)}>
                    <Icon.TrashCanSolid size="20" color="#87cefa" />
                  </button> 
                </span>
              </td>
              
              <td>{stockToday(med)}</td>
              <td>{daysLeft(med)}</td>
              <td>{expiryDate(med)}</td>
            </tr>
            {/each}
            <tr>
              <td colspan="9">
                <div class="buttonrow">
                    <button class="tags" data-tooltip="Add new medication" on:click={() => addMed()}>
                      <Icon.PlusSolid  size="20" color="#87cefa" />
                    </button>
                  <button class="tags" data-tooltip="Save medications" on:click={() => saveMeds(meds)}>
                    <Icon.FloppyDiskSolid  size="20" color="#87cefa" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      {/if}
    </div>
    </div>


  <Dialog name="medication-dialog">
    <span slot="header">Add new medication</span>
    <span slot="content">
      <form method="dialog" on:submit|preventDefault={() => handleSubmit("medication-dialog")}>
        <div class="row">
          <label for="name">Name:</label><input type="text" id="name" placeholder="Name" />
        </div>
        <div class="row">
          <label for="amount">Amount:</label><input type="number" step="0.5" id="amount" placeholder="0" />
          <label for="dosage">Dosage:</label><input type="number" step="0.5" id="dosage" placeholder="0" />
          <label for="stock">Stock:</label><input type="number" step="0.5" id="stock" placeholder="0" />
        </div>
        <div class="buttonrow">
            <button type="submit" value="ok"><Icon.CheckSolid color="#87cefa"/></button>
            <button type="button" on:click={() => closeDialog("medication-dialog")}><Icon.BanSolid color="#87cefa"/></button>
        </div>
      </form>
    </span>
  </Dialog>

  <Dialog name="delete-dialog">
    <span slot="header">Delete medication</span>
    <span slot="content">
      <form method="dialog" on:submit|preventDefault={() => handleSubmitDelete("delete-dialog")}>
        <div class="row">
            Are you sure you want to delete &nbsp;<span id="name"></span>?
            <input type="hidden" id="name" />
        </div>
        <div class="buttonrow">
            <button type="submit" value="ok"><Icon.CheckSolid color="#87cefa"/></button>
            <button type="button" on:click={() => closeDialog("delete-dialog")}><Icon.BanSolid color="#87cefa"/></button>
        </div>
      </form>
    </span>
  </Dialog> 

  <Dialog name="user-dialog">
    <span slot="header">Add new User</span>
    <span slot="content">
    <form method="dialog" on:submit|preventDefault={() => handleSubmitUser("user-dialog")}>
      <div class="row">
        <label for="user">User:</label><input type="text" id="user" placeholder="Username" />
      </div>
      <div class="buttonrow">
          <button type="submit" value="ok"><Icon.CheckSolid color="#87cefa"/></button>
          <button type="button" on:click={() => closeDialog("user-dialog")}><Icon.BanSolid color="#87cefa"/></button>
      </div>
    </form>
    </span>
  </Dialog>

  <Dialog name="add-stock-dialog">
    <span slot="header">Add stock</span>
    <span slot="content">
    <form method="dialog" on:submit|preventDefault={() => handleSubmitAddStock("add-stock-dialog")}>
      <input type="hidden" id="name" placeholder="Name" />
      <div class="row">
        <label for="stock">Stock:</label><input type="number" step="0.5" id="stock" placeholder="0" />
      </div>
      <div class="buttonrow">
          <button type="submit" value="ok"><Icon.CheckSolid color="#87cefa"/></button>
          <button type="button" on:click={() => closeDialog("add-stock-dialog")}><Icon.BanSolid color="#87cefa"/></button>    
      </span>
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
    font-family: Geneva, Verdana, sans-serif;
    font-size: 1.2em;
    font-weight: bold;
    padding-left: 20px;
    text-align: left;
  }

  .container .top-bar .message {
    color: lightskyblue;
    width:500px;
  }

  .container .top-bar button {
    background-color: grey;
    border: none;
    cursor: pointer;
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

  .content table td {
        padding: 10px;
        border: 1px solid grey;
        text-align: left;
        vertical-align: top;
    }

  .content table .spacer {
    display: inline-flex;
    border: none;
    background-color: inherit;
  }

  .content table td input {
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
  .content p {
    text-align: left;
    margin: 10px;
    margin-left: 20px;
    font-size: smaller;
  }

  .container select {
    display: inline-flex;
    color: lightskyblue;
    cursor: text;
    border: 1px solid #87cefa;
    padding: 3px;
    font-size: 0.8em;
    justify-content: right;
    background-color: #212121;
    margin-right: 10px;
    margin-left: 10px;
    -moz-appearance: none; 
    -webkit-appearance: none; 
    appearance: none;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%2387CEFA'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat;
    background-size: 12px;
    background-position: calc(100% - 5px) center;
    background-repeat: no-repeat;
  }
  form input {
    width: 50px;
  }

  form input#name, form input#user{
    width: 200px;
  }

  .container button {
    background-color: #212121;
    border: none;
    cursor: pointer;
  }

  form .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  form .buttonrow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px;
    width:100%;
  }

  form .buttonrow button {
    background-color: black;
    border: none;
    cursor: pointer;
    margin-left: 10px;
  }

  .top-bar select {
    
    width: 200px;
  }

  .top-bar select option * {
    background-color: black;
    color: white;
  }

  .top-bar button {
    background-color: grey;
    border: none;
    cursor: pointer;
  }

.tags {
  display: inline;
  position: relative;
}

.tags:hover:after {
  border-radius: 15px;
  bottom: 35px;
  color: #87cefa;
  content: attr(data-tooltip);
  right: -40px;
  padding: 10px;
  position: absolute;
  z-index: 98;
  min-width: 200px;
  border: 1px solid #fff;
  background-color: #212121;
  font-size: 1.3em;
}

.tags:hover:before {
  border: solid;
  border-color: #333 transparent;
  border-width: 0 6px 6px 6px;
  bottom: -4px;
  content: "";
  left: 50%;
  position: absolute;
  z-index: 99;
}
</style>
