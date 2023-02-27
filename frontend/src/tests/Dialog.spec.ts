import {test, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import html from 'svelte-htm';

import Dialog from '../Dialog.svelte';


let dialog;
const showDialog = vi.fn()
const closeDialog = vi.fn()
const handleSubmit = vi.fn()

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

  const title = screen.getByText("This is the header");
  expect(title).toBeTruthy();

  const content = screen.getByText("This is the content");
  expect(title).toBeTruthy();

});

test("Dialog buttons", async () => {
  
  const user = userEvent.setup();

  const showButton = screen.getByText("Show Dialog");
  await user.click(showButton);
  expect(showDialog).toHaveBeenCalledOnce();

  const closeButton = screen.getByText("cancel");
  await user.click(closeButton);
  expect(closeDialog).toHaveBeenCalledOnce();

  const submitButton = screen.getByText("submit");
  await user.click(submitButton);
  expect(handleSubmit).toHaveBeenCalledOnce(); 
});