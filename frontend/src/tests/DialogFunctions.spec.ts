import {test, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';
import userEvent from '@testing-library/user-event';

import Dialog, { showDialog, closeDialog, clearForm, ref } from 'src/Dialog.svelte';

beforeAll(() => {
  render(html`
  <button name="show" on:click=${() => showDialog("test-dialog", true)}>Show Dialog</button>
  <${Dialog} name="test-dialog">
      <span slot="header">This is the header</span>
      <span slot="content">This is the content</span>
    </${Dialog}>
    <${Dialog} name="another-test-dialog">
      <span slot="header">This is the header</span>
      <span slot="content">
        <form action="dialog">
          <input type="text" name="test"/>
        </form>
      </span>
    </${Dialog}>
  `)
});


test("Dialog function ref", async () => {
    let instance1 = ref("test-dialog")
    let instance2 = ref("another-test-dialog")

    expect(instance1).toBeInstanceOf(HTMLDialogElement);
    expect(instance1.id).toBe("test-dialog");

    expect(instance2).toBeInstanceOf(HTMLDialogElement);
    expect(instance2.id).toBe("another-test-dialog");
});

test("Dialog function clearForm", async () => {
    let instance = ref("another-test-dialog");
    let input = instance.querySelector("input");

    input.value = "test";
    expect(input.value).toBe("test");

    clearForm("another-test-dialog");
    expect(input.value).toBe("");
});

// test("Dialog function showDialog", async () => {
//   render(Dialog)
//   let instance = ref("test-dialog");
//   expect(instance.open).toBe(false);

//   const showButton = screen.getByText("Show Dialog");
//   const user = userEvent.setup();
//   await user.click(showButton);
  
//   expect(instance.open).toBe(true);

//   });