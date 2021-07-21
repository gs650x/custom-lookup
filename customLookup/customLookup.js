import { LightningElement, api } from 'lwc';

export default class CustomLookup extends LightningElement {

    //Pass option as an array of objects with lable and value same as lightning-combobox options
    @api options;

    _width
    @api get width() {
        return this._width;
    }
    set width(value) {
        this._width = `width:${value}`
    }

    @api placeHolder = 'Select an Option'
    @api label = 'Custom lookup'

    inputValue = '';
    optionsToDisplay = this.options;
    dropdownSelector = 'display:none';
    disableInput = false;

    connectedCallback() {
        this.optionsToDisplay = this.options
    }

    //to manage the click to open or close the slds dropdown.
    renderedCallback() {
        let self = this;
        this.template.querySelector(`[data-id="combo-input"]`)
            .addEventListener('click', function (event) {
                self.dropdownSelector = 'display:block';
                //stopping propagation so that below event listner won't handle click event 
                event.stopPropagation();

            })
        document.addEventListener('click', function (event) {
            self.dropdownSelector = 'display:none'
        })
    }

    handleSelectedOption(event) {
        this.inputValue = this.options.find(({ value }) => value == event.target.dataset.id).label;
        this.disableInput = true;
    }

    handleInputChange(event) {
        this.inputValue = event.target.value;
        let inputValue = event.target.value ? event.target.value.toLowerCase() : event.target.value;
        this.optionsToDisplay = this.options.filter(({ label }) => label.toLowerCase().includes(inputValue))
    }

    handleRemoveValue() {
        this.inputValue = '';
        this.disableInput = false;
    }
}