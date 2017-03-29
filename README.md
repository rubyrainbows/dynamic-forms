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
See [the playground](https://rubyrainbows.github.io/dynamic-forms/playground.html) for a working example.
```html
...
<form>
    Single Input:
    <br/>

    <div data-dynamic-form>
        <div data-dynamic-form-template="single">
            <label>
                <input type="text" name="single[ID]" data-dynamic-form-input-id-template="ID"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>

    <br/>
    <br/>
    Multi Input:
    <br/>
    <div data-dynamic-form>
        <div data-dynamic-form-template="multi">
            <label>
                <input type="text" name="multi[ID][foo]" data-dynamic-form-input-id-template="ID"/>
                <input type="text" name="multi[ID][bar]" data-dynamic-form-input-id-template="ID"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>

    <br/>
    <br/>
    Single Input with Fill:
    <br/>

    <div data-dynamic-form>
        <div data-dynamic-form-template="single_fill" data-dynamic-form-fill='{ "0": "foo", "1": "bar", "344": "foo-bar" }'>
            <label>
                <input type="text" name="single_fill[ID]" data-dynamic-form-input-id-template="ID"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>

    <br/>
    <br/>
    Multi Input with Fill:
    <br/>

    <div data-dynamic-form>
        <div data-dynamic-form-template="multi_fill"
             data-dynamic-form-fill='{ "0": {"foo": "foo 0", "bar": "bar 0"}, "1": {"foo": "foo 1", "bar": "bar 1"} }'>
            <label>
                <input type="text" name="multi_fill[ID][foo]" data-dynamic-form-input-id-template="ID"
                       data-dynamic-form-input-name="foo"/>
                <input type="text" name="multi_fill[ID][bar]" data-dynamic-form-input-id-template="ID"
                       data-dynamic-form-input-name="bar"/>
                <button type="button" data-dynamic-form-add>Add</button>
                <button type="button" data-dynamic-form-remove>Remove</button>
            </label>
        </div>
    </div>
</form>
<script>
    $(document).ready(function () {
        var dynamicForms = new DynamicForms();
        dynamicForms.automaticallySetupForm();
    });
</script>
...
```
**Usage Notes:**

* `data-dynamic-form` sets up a form section to be made dynamic. This is the container where new rows will be placed.
* `data-dynamic-form-template` defines the div as a template, and the value given is the id for the template. This div will be removed from the form to prevent it from being used as input.
* `data-dynamic-form-add` defines a button that is used to create a new row.
* `data-dynamic-form-remove` defines a button that is used to remove a row.
* `data-dynamic-form-input-id-template` is used for naming of dynamically added rows. The value will be replaced with the id.
* `data-dynamic-form-input-name` is used by the fill to fill the input field.

### Input Naming

* If you supply data with `data-dynamic-form-fill`, the form will automatically create new rows with the data.
* Any supplied rows with `data-dynamic-form-fill` will be added to the form with their id.
* Any new rows will be given an id by a base 26 alphabet system: a,b,c,...aa,ab,ac....


### Adding an observer

If you ever want to capture events such as creating/removing a new row, you will need to create an observer.

Here is an example:

```html
...
<script>
    function Observer() {
        this.elementsCreated = 0;
        this.elementsRemoved = 0;
    }

    Observer.prototype.rowWasCreated = function (element) {
        this.elementsCreated++;
    };

    Observer.prototype.rowWasRemoved = function (element) {
        this.elementsRemoved++;
    };
    
    $(document).ready(function () {
        var dynamicForms = new DynamicForms();
        var observer = new Observer();
        dynamicForms.automaticallySetupForm();
        dynamicForms.addObserver(observer);
    });
</script>
...
```
* Whenever a row is created, the function `rowWasCreated` will be called.
* Whenever a row is removed, the function `rowWasRemoved` will be called.
