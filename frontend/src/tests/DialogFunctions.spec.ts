import {test, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import html from 'svelte-htm';

import Dialog, { showDialog, closeDialog, clearForm, ref } from 'src/Dialog.svelte';
import type { ComponentType } from 'svelte';

beforeAll(() => {
    let dialog = render(html`
        <${Dialog} name="test-dialog">
            <span slot="header">This is the header</span>
            <span slot="content">This is the content</span>
        </${Dialog}>
        <${Dialog} name="another-test-dialog">
            <span slot="header">This is the header</span>
            <span slot="content">This is the content</span>
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

test("Dialog function showDialog", async () => {
    let component:ComponentType = Dialog;

    let spyShowDialog = vi.spyOn<ComponentType, any>(component, "showDialog");

    showDialog("test-dialog", true);

    expect(spyShowDialog).toHaveBeenCalledOnce();
});