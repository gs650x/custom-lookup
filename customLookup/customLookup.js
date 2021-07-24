/**
 * @author Gurjit Singh
 * @date 21/July/2021
 * @group Custom-lookup
 * @description Renders Custom look with multi and single select option.
 */
import { LightningElement, api, track } from 'lwc';

export default class CustomLookup extends LightningElement {

    //Public properties
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
    @api showTags;

    //End of public properties

    inputValue = '';
    optionsToDisplay = this.options;
    dropdownSelector = 'display:none';
    disableInput = false;
    @track selectedTags = [];

    get showTagsContainer() {
        return this.selectedTags.length > 0;
    }

    connectedCallback() {
        this.optionsToDisplay = this.options
    }

    //to manage the click to open or close the slds dropdown.
    renderedCallback() {
        let self = this;

        this.template.querySelector(`[data-id="combo-input"]`)
            .addEventListener('click', event => {
                if (!self.disableInput) {
                    self.dropdownSelector = 'display:block';
                }
                //stopping propagation so that below event listner won't handle click event 
                event.stopPropagation();

            })
        document.addEventListener('click', () => {
            self.dropdownSelector = 'display:none'
        })
    }

    handleSelectedOption(event) {

        let selectedData;
        let selectedRecord = this.options.find(({ value }) => value == event.target.dataset.id);
        this.optionsToDisplay = this.optionsToDisplay.filter(({ value }) => value != event.target.dataset.id);

        if (this.showTags) {
            this.selectedTags.push(selectedRecord);
            selectedData = this.selectedTags;
        } else {
            this.inputValue = selectedRecord.label;
            this.disableInput = true;
            selectedData = selectedRecord;
        }

        this.dispatchEvent(new CustomEvent('valuechange', {
            detail: { selectedData, showTags: this.showTags }
        }))
    }

    handleTagRemove(event) {
        this.selectedTags = this.selectedTags.filter(({ value }) => value != event.detail.item.value);
        for (const option of this.options) {
            if (option.value == event.detail.item.value) {
                this.optionsToDisplay.unshift(option);
            }
        }
        this.dispatchEvent(new CustomEvent('optionremove', {
            detail: { selectedData: this.selectedTags, showTags: this.showTags }
        }))
    }


    handleInputChange(event) {
        let inputValue;
        if (this.showTags) {
            this.inputValue = event.target.value;
        }

        inputValue = event.target.value ? event.target.value.toLowerCase() : event.target.value;
        this.optionsToDisplay = this.options.filter(({ label }) => label.toLowerCase().includes(inputValue))
    }

    handleRemoveValue() {
        this.inputValue = '';
        this.disableInput = false;
        this.optionsToDisplay = this.options
        this.dispatchEvent(new CustomEvent('optionremove', {
            detail: true
        }))
    }
}