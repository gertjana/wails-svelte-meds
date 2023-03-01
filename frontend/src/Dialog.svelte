<script lang="ts" context="module">

  let dialogs: { [key: string]: HTMLDialogElement } = {};

  /**
   * Show the dialog with the given name
   * @param dialog_name name of the dialog
   * @param asModal if true, show as modal
   */
  export const showDialog = (dialog_name: string, asModal: boolean) => {
    dialogs[dialog_name][asModal ? "showModal" : "show"];
  }

  /**
   * Close the dialog with the given name
   * @param dialog_name name of the dialog
  */
  export const closeDialog = (dialog_name: string) => {
    dialogs[dialog_name].close();
  }

  /**
   * Clears all forms in the dialog with the given name
   * @param dialog_name name of the dialog
  */
  export const clearForm = (dialog_name: string) => {
    let forms:HTMLFormElement[] = Array.from(dialogs[dialog_name].querySelectorAll("form")); 
    forms.forEach(form => {
      form.reset();
    });
  }

  /**
   * Returns the dialog with the given name
   * @param dialog_name name of the dialog
  */
  export const ref: (string) => HTMLDialogElement = (dialog_name: string) => {
    return dialogs[dialog_name];
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  
  export let name: string = "";
  
  onMount(() => {
    let dialog = <HTMLDialogElement> document.getElementById(name);
		dialogs[name] = dialog;
	})

</script>

<dialog id='{name}'>
  <div class="dialog">
    <div class="header">
      <h3><slot name="header">Header...</slot></h3>
    </div>
    <slot name="content">
      <p>Content...</p>
    </slot>
  </div>
</dialog>

<style>
  dialog {
    padding: 10px;
    position: absolute;
    z-index: 999;
    top: 30%;
    left: 30%;
    transform: translate(-50%, -50%);
    background: black;
    max-width: 500px;
    min-width: 250px;
    border-radius: 1em;  
    border: 1px solid grey;
    color: white;
  }
  .dialog .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .dialog h3 {
    margin-top: 0px;
  }

</style>