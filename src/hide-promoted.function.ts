const hiddenSet = new WeakSet<Element>();

function hideElement(el: Element) {
    if (hiddenSet.has(el)) return;
    try {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
    } catch (e) {
        (el as HTMLElement).style.display = 'none';
    }
    hiddenSet.add(el);
}

function findPostAncestor(el: Element): Element | null {
    return (
        el.closest('article') ||
        el.closest('div[role="article"]') ||
        el.closest('div.feed-shared-update') ||
        el.closest('div.feed-shared-update-v2') ||
        el.closest('div.occludable-update') ||
        el.closest('div.feed-shared-actor') ||
        el.closest('div.feed-shared-commentary') ||
        el.closest('div.comments-comment-item') ||
        el.closest('div.comments-comments-list__comment-item') ||
        el.closest('div.comments-comment-card') ||
        el.closest('[data-comment-id]') ||
        el.closest('[data-test-comment-item]') ||
        el.closest('div[data-id]') ||
        el.closest('div[data-urn]') ||
        el.closest('div[data-entity-urn]') ||
        el.closest('div[data-feed-item-id]') ||
        el.closest('[data-test-feed-item]') ||
        null
    );
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function hidePromoted(options: { hidePromoted: boolean; hideSuggested: boolean; hideCustom: boolean; customKeywords: string } = { hidePromoted: true, hideSuggested: true, hideCustom: false, customKeywords: '' }): void {
    const terms: string[] = [];
    if (options.hidePromoted) terms.push('promoted');
    if (options.hideSuggested) terms.push('suggested');

    if (options.hideCustom && options.customKeywords) {
        const customTerms = options.customKeywords
            .split(',')
            .map((term) => term.trim())
            .filter(Boolean);
        terms.push(...customTerms);
    }

    if (terms.length === 0) return; // Nothing to hide

    const xpathConditions = terms
        .map((term) => {
            const lowered = term.toLowerCase();
            return `contains(translate(., '${term.toUpperCase()}', '${lowered}'), '${lowered}')`;
        })
        .join(' or ');
    const xpath = `//text()[${xpathConditions}]`;
    const iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'i');

    for (let i = 0; i < iterator.snapshotLength; i++) {
        const node = iterator.snapshotItem(i);
        if (!node || !node.parentElement) continue;

        const ancestor = findPostAncestor(node.parentElement);
        if (ancestor) hideElement(ancestor);
    }

    const promotes = Array.from(document.querySelectorAll('span, button, div, p, strong, b')).filter(
        (el) => el.textContent && regex.test(el.textContent)
    );
    promotes.forEach((el) => {
        const ancestor = findPostAncestor(el);
        if (ancestor) hideElement(ancestor);
    });
}
