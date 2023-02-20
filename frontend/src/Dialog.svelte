<script lang="ts" context="module">

  let dialogs: { [key: string]: HTMLDialogElement } = {};

  /**
   * Show the dialog with the given name
   * @param dialog_name name of the dialog
   * @param asModal if true, show as modal
   */
  export const showDialog = (dialog_name: string, asModal: boolean) => {
    dialogs[dialog_name][asModal ? "showModal" : "show"]();
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
  export const ref = (dialog_name: string) => {
    return dialogs[dialog_name];
  } 
</script>

<script lang="ts">
  import { onMount } from "svelte";
  
  export let name: string = "";
  
  // let dialog: HTMLDialogElement;

  onMount(() => {
    let dialog = <HTMLDialogElement> document.getElementById(name);
		dialogs[name] = dialog;
	})

</script>

<dialog id='{name}'>
  <slot>
    <p>Content here please</p>
  </slot>
</dialog>

<style>
  dialog {
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
    padding: 10px;
    position: absolute;
    z-index: 999;
    top: 30%;
    left: 30%;
    transform: translate(-50%, -50%);
    background: black;
    max-width: 500px;
    border-radius: 1em;  
    border: 1px solid grey;
    color: white;
  }
</style>