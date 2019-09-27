import * as ActiveAdmin from "../lib/active-admin";

$.widget.bridge('tableCheckboxToggler', ActiveAdmin.TableCheckboxToggler);
$.widget.bridge('checkboxToggler', ActiveAdmin.CheckboxToggler);
$.widget.bridge('aaDropdownMenu', ActiveAdmin.DropdownMenu);
$.widget.bridge('aaBatchActions', ActiveAdmin.BatchActions);

const initBatchActions = () => $('#collection_selection').aaBatchActions();

$(document).
  ready(initBatchActions).
  on('page:load turbolinks:load', initBatchActions);

const initDropdownMenus = () => $('.dropdown_menu').aaDropdownMenu();

$(document).
  ready(initDropdownMenus).
  on('page:load turbolinks:load', initDropdownMenus);

$(document).
  on('change', '.pagination_per_page > select', function(event) {
    ActiveAdmin.PerPage._jQueryInterface.call($(this), 'update')
  });

$.fn['perPage'] = ActiveAdmin.PerPage._jQueryInterface;
$.fn['perPage'].Constructor = ActiveAdmin.PerPage;
