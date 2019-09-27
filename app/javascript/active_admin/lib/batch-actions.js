import ModalDialog from './modal-dialog';

class BatchActions {
  constructor(options, element) {
    // '.batch_actions_selector'
    this.element = element;
    this.$element = $(this.element);
    this.$batchActionsSelector = this.$element.find('.batch_actions_selector');
    this.$batchActionInputs = this.$element.find('#batch_action_inputs');
    this.$batchAction = this.$element.find('#batch_action');
    this.$paginatedCollection = this.$element.find('.paginated_collection');
    this._init();
    this._bind();
  }

  option(key, value) {
  }

  _init() {
    // Detach any previously attached handlers before re-attaching them.
    // This avoids double-registered handlers when Turbolinks is enabled
    this.$batchActionsSelector.find('li a').off('click confirm:complete');

    //
    // Use ModalDialog to prompt user if
    // confirmation is required for current Batch Action
    //
    this.$batchActionsSelector.find('li a').on('click', (event) => {
      let message;
      event.stopPropagation(); // prevent Rails UJS click event
      event.preventDefault();
      if ((message = $(event.target).data('confirm'))) {
        ModalDialog(message, $(event.target).data('inputs'), inputs => {
          $(event.target).trigger('confirm:complete', inputs);
        });
      } else {
        $(event.target).trigger('confirm:complete');
      }
    });

    this.$element.find('li a').on('confirm:complete', (event, inputs) => {
      let val;
      if ((val = JSON.stringify(inputs))) {
        this.$batchActionInputs.removeAttr('disabled').val(val);
      } else {
        this.$batchActionInputs.attr('disabled', 'disabled');
      }

      this.$batchAction.val($(event.target).data('action'));
      $('#collection_selection').submit();
    });
  }

  _bind() {
    //
    // Add checkbox selection to resource tables and lists if batch actions are enabled
    //

    if (this.$batchActionsSelector.length && $(":checkbox.toggle_all").length) {

      if (this.$paginatedCollection.find("table.index_table").length) {
        this.$paginatedCollection.find("table.index_table").tableCheckboxToggler();
      } else {
        this.$paginatedCollection.checkboxToggler();
      }

      $(document).on('change', this.$paginatedCollection.find(':checkbox'), (event) => {
        if (this.$paginatedCollection.find(":checkbox:checked").length && $(".dropdown_menu_list").children().length) {
          this.$batchActionsSelector.each(function() { $(this).aaDropdownMenu("enable"); });
        } else {
          this.$batchActionsSelector.each(function() { $(this).aaDropdownMenu("disable"); });
        }
      });
    }
  }
};

export default BatchActions;
