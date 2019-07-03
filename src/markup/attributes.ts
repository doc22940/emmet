import { EMAttribute, EMElement } from '@emmetio/abbreviation';
import { cloneAttribute } from './utils';

/**
 * Merges attributes in current node: de-duplicates attributes with the same name
 * and merges class names
 */
export default function mergeAttributes(node: EMElement) {
    const attributes: EMAttribute[] = [];
    const lookup: { [name: string]: EMAttribute } = {};

    for (const attr of node.attributes) {
        if (attr.name) {
            if (attr.name in lookup) {
                const prev = lookup[attr.name];
                if (attr.name === 'class') {
                    prev.value = {
                        type: 'EMLiteral',
                        value: getValue(prev) + ' ' + getValue(attr)
                    };
                } else {
                    Object.assign(prev, attr);
                }
            } else {
                // Create new attribute instance so we can safely modify it later
                attributes.push(lookup[attr.name] = cloneAttribute(attr));
            }
        } else {
            attributes.push(attr);
        }
    }

    node.attributes = attributes;
}

/**
 * Returns attribute value as string. If value is absent, returns empty string
 */
function getValue(attr: EMAttribute): string {
    return attr.value ? attr.value.value : '';
}