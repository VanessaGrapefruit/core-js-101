function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const properties = {};
  Object.getOwnPropertyNames(obj).forEach((key) => {
    properties[key] = {
      writable: true,
      value: obj[key],
      configurable: true,
      enumerable: true,
    };
  });
  return Object.create(proto, properties);
}

function throwErr() {
  throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
}

module.exports = class CssSelectorBuilder {
  constructor() {
    this.elementValue = '';
    this.idValue = '';
    this.classValue = '';
    this.attrValue = '';
    this.pseudoClassValue = '';
    this.pseudoElementValue = '';
    this.isFirst = true;
  }

  dispose() {
    this.elementValue = '';
    this.idValue = '';
    this.classValue = '';
    this.attrValue = '';
    this.pseudoClassValue = '';
    this.pseudoElementValue = '';
  }

  create() {
    const result = fromJSON(CssSelectorBuilder, JSON.stringify(this));
    this.dispose();
    return result;
  }

  element(value) {
    if (!this.elementValue) this.elementValue += value;
    else {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  id(value) {
    this.element = throwErr;
    if (!this.idValue) this.idValue += `#${value}`;
    else {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  class(value) {
    this.element = throwErr;
    this.id = throwErr;
    this.classValue += `.${value}`;
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  attr(value) {
    this.element = throwErr;
    this.id = throwErr;
    this.class = throwErr;
    this.attrValue += `[${value}]`;
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  pseudoClass(value) {
    this.element = throwErr;
    this.id = throwErr;
    this.class = throwErr;
    this.attr = throwErr;
    this.pseudoClassValue += `:${value}`;
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  pseudoElement(value) {
    this.element = throwErr;
    this.id = throwErr;
    this.class = throwErr;
    this.attr = throwErr;
    this.pseudoClass = throwErr;
    if (!this.pseudoElementValue) this.pseudoElementValue += `::${value}`;
    else {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const result = this.isFirst ? this.create() : this;
    this.isFirst = false;
    return result;
  }

  stringify() {
    const result = this.elementValue + this.idValue + this.classValue
            + this.attrValue + this.pseudoClassValue + this.pseudoElementValue;
    this.dispose();
    return result;
  }
};
