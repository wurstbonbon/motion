import { IProjectionNode } from "./types"

const notify = (node: IProjectionNode) =>
    !node.isLayoutDirty && node.willUpdate(false)

export interface NodeGroup {
    add: (node: IProjectionNode) => void
    remove: (node: IProjectionNode) => void
}

export function nodeGroup(): NodeGroup {
    const nodes = new Set<IProjectionNode>()
    const subscriptions = new WeakMap<IProjectionNode, () => void>()

    const dirtyAll = () => nodes.forEach(notify)

    return {
        add: (node) => {
            nodes.add(node)
            subscriptions.set(node, node.onLayoutWillUpdate(dirtyAll))
        },
        remove: (node) => {
            nodes.delete(node)
            subscriptions.get(node)?.()
            subscriptions.delete(node)
        },
    }
}