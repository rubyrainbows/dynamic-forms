# Javascript Dynamic Forms

[![Build Status](https://travis-ci.org/rubyrainbows/dynamic-forms.svg?branch=master)](https://travis-ci.org/rubyrainbows/dynamic-forms)
[![npm version](https://badge.fury.io/js/%40rubyrainbows%2Fdynamic-forms.svg)](https://badge.fury.io/js/%40rubyrainbows%2Fdynamic-forms)

Dynamic forms is a javascript library meant to help make normal HTML forms more dynamic.

## Setup

**Notes:**
* The jQuery library is required
* The compiled versions for this library are under the directory `dist`.

```html
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/dynamic_forms.js"></script>
```

## Example
See `test/playground.html` for a working example.
```html
...
<form>
    Foo:
    <br/>
    <div data-dynamic-form>
        <div data-dynamic-form-template="foo">
            <label>
                <input type="text" name="foo[ID][foo]" data-dynamic-form-input="ID"/>
                <input type="text" name="foo[ID][bar]" data-dynamic-form-input="ID"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>

    <br/>
    <br/>
    Bar:
    <br/>

    <div data-dynamic-form>
        <div data-dynamic-form-template="bar" data-dynamic-form-fill='{ "0": "foo", "1": "bar" }'>
            <label>
                <input type="text" name="bar[ID]" data-dynamic-form-input="ID"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>
</form>
...
```
**Usage Notes:**

* `data-dynamic-form` sets up a form section to be made dynamic. This is the container where new rows will be placed.
* `data-dynamic-form-template` defines the div as a template, and the value given is the id for the template. This div will be removed from the form to prevent it from being used as input.
* `data-dynamic-form-add` defines a button that is used to create a new row.
* `data-dynamic-form-remove` defines a button that is used to remove a row.
* `data-dynamic-fom-input` is used for naming of dynamically added rows.

### Input Naming

* If you supply data with `data-dynamic-form-fill`, the form will automatically create new rows with the data.
* Any supplied rows with `data-dynamic-form-fill` will be added to the form with their id.
* Any new rows will be given an id by a base 26 alphabet system: a,b,c,...aa,ab,ac....
