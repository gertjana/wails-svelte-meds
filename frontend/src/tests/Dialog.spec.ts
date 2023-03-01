import {test, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import html from 'svelte-htm';
import Dialog from '../Dialog.svelte';

let dialog = "";
const showDialog = vi.fn().mockImplementation((name, show) => { dialog = show ? "showModal" : "show" });
const closeDialog = vi.fn().mockImplementation((name) => { dialog = "close" });
const handleSubmit = vi.fn().mockImplementation((name, e) => { e.preventDefault()}); 

beforeAll(() => {
  const dialog = render(html`
    <${Dialog} name="test-dialog">
      <span slot="header">This is the header</span>
      <span slot="content">
        <button name="show" on:click=${() => showDialog("test-dialog", true)}>Show Dialog</button>
        <p>This is the content</p>
        <form action="dialog" on:submit|preventDefault=${(e: Event) => handleSubmit("test-dialog", e)}>
          <button name="submit" type="submit">submit</button>
          <button name="cancel" on:click=${() => closeDialog("test-dialog")}>cancel</button>
          </form>
      </span>       
    </${Dialog}>
    `);
});

test("Dialog component slots", async () => {
  console.log(dialog);

  const title = screen.getByText("This is the header");
  expect(title).toBeTruthy();

  const content = screen.getByText("This is the content");
  expect(title).toBeTruthy();

});

test("Dialog buttons", async () => {
  
  const user = userEvent.setup();

  // open dialog
  const showButton = screen.getByText("Show Dialog");
  await user.click(showButton);
  expect(showDialog).toHaveBeenCalledOnce();

  expect(dialog).toBe("showModal");

  // submit dialog
  const submitButton = screen.getByText("submit");
  await user.click(submitButton);
  expect(handleSubmit).toHaveBeenCalledOnce(); 

  // close dialog
  const closeButton = screen.getByText("cancel");
  await user.click(closeButton);
  expect(closeDialog).toHaveBeenCalledOnce();

  expect(dialog).toBe("close");

});