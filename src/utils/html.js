// hono/html

/**
 * @param {string} str
 * @param {string[]} buffer
 */
function escapeToBuffer(str, buffer) {
  const match = str.search(/[&<>"]/);
  if (match === -1) {
    buffer[0] += str;
    return;
  }
  let escape;
  let index;
  let lastIndex = 0;
  for (index = match; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape;
    lastIndex = index + 1;
  }
  buffer[0] += str.substring(lastIndex, index);
}

/**
 * @param {any} value
 * @returns {String & {isEscaped: true}}
 */
export function raw(value) {
  /** @type {String & {isEscaped: true}} */
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  return escapedString;
}

/**
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {String & {isEscaped: true}}
 */
export function html(strings, ...values) {
  const buffer = [""];
  for (let i = 0, len = strings.length - 1; i < len; i++) {
    buffer[0] += strings[i];
    const children =
      values[i] instanceof Array ? values[i].flat(Infinity) : [values[i]];
    for (let i2 = 0, len2 = children.length; i2 < len2; i2++) {
      const child = children[i2];
      if (typeof child === "string") {
        escapeToBuffer(child, buffer);
      } else if (
        typeof child === "boolean" ||
        child === null ||
        child === void 0
      ) {
        continue;
      } else if (
        (typeof child === "object" && child.isEscaped) ||
        typeof child === "number"
      ) {
        buffer[0] += child;
      } else {
        escapeToBuffer(child.toString(), buffer);
      }
    }
  }
  buffer[0] += strings[strings.length - 1];
  return raw(buffer[0]);
}
