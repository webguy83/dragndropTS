/// <reference path="drag-drop.ts" />
/// <reference path="components/custom-form.ts" />
/// <reference path="product-model.ts" />
/// <reference path="state/index.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  new CustomForm();
  new ProjectList('active');
  new ProjectList('finished');
}
