import Vue from 'vue'
export default {
    findTreePathByArray(id, array) {
        for (const key in array) {
            let path = this.findTreePath(id, array[key]);
            if (path) {
                return path;
            }
        }
        return null;
    },

    findTreePath(id, node, path = []) {
        path.push(node.id);
        if (id == node.id) {
            return path;
        }
        if (!node.children || node.children.length == 0) {
            return null;
        }
        for (const key in node.children) {
            const element = node.children[key];
            let tmpPath = this.findTreePath(id, element, path);
            if (tmpPath) {
                return tmpPath;
            }
        }
        return null;
    },

    findLastByArray(array) {
        return !array || array.length == 0
            ? undefined
            : array[array.length - 1];
    },

    treeToArray(data, parent, level, expandedAll) {
        let that = this;
        let tmp = []
        Array.from(data).forEach(function (record) {
            if (record._expanded === undefined) {
                Vue.set(record, '_expanded', expandedAll)
            }
            if (parent) {
                Vue.set(record, '_parent', parent)
            }
            let _level = 0
            if (level !== undefined && level !== null) {
                _level = level + 1
            }
            Vue.set(record, '_level', _level)
            tmp.push(record)
            if (record.children && record.children.length > 0) {
                let children = that.treeToArray(record.children, record, _level, expandedAll)
                tmp = tmp.concat(children)
            }
        })
        return tmp
    }
}