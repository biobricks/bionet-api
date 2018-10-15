"use strict";

module.exports = class BionetBatchUpload {
    constructor() {
    }
    uploadIntoContainer(upload_method, upload_container, data, bionetApi, cb) {
        switch (upload_method) {
            case 'virtual':
                break;
            case 'physical':
                break;
            case 'virtual_to_physical':
                this.virtualToPhysicalUpload(bionetApi, upload_container, data, cb)
                break;
        }
    }

    virtualToPhysicalUpload(bionetApi, id, dataset, cb) {

        bionetApi.getLocationPathChildren(id, function (err, _locationPath) {
            function getChildInstances(item) {
                let children = (item) ? item.children : null;
                let childCells = {};
                if (children) {
                    for (let i = 0; i < children.length; i++) {
                        let child = children[i];
                        let index = child.parent_x + ',' + child.parent_y;
                        childCells[index] = child.id;
                    }
                }
                return childCells
            }

            function getEmptyCells(childCells, rows, cols) {
                const emptyCellArray = [];
                for (let row = 1; row <= rows; row++) {
                    for (let col = 1; col <= cols; col++) {
                        let index = col + ',' + row;
                        if (!childCells[index]) {
                            emptyCellArray.push({
                                parent_y: row,
                                parent_x: col
                            });
                        }
                    }
                }
                return emptyCellArray
            }
            if (err) {
                cb(err)
                return
            } else {
                var container = null
                for (var i = 0; i < _locationPath.length; i++) {
                    if (_locationPath[i].id === id) {
                        container = _locationPath[i]
                        break
                    }
                }
                var childCells = getChildInstances(container)
                var emptyCells = getEmptyCells(childCells, container.xUnits, container.yUnits)

                //todo: error if empty cells < dataset size

                // generate column/name mapping
                var colname = dataset[0]
                var colindex = {}
                for (var col = 0; col < colname.length; col++) {
                    colindex[colname[col]] = col
                }

                // iterate through each row in data set and generate virtual and physical instances
                var instance = 0;
                var physicals = []
                var nrem = dataset.length - 1
                for (var row = 1; row < dataset.length; row++) {
                    var rowdata = dataset[row]
                    var virtualName = rowdata[colindex.Name]

                    // create virtual
                    var virtual = {
                        name: virtualName,
                        description: rowdata[colindex.Description],
                        sequence: rowdata[colindex.Sequence]
                    }
                    bionetApi.saveVirtual(virtual, function (err, virtualId) {
                        if (err) {
                            cb(err)
                            return
                        }
                        // create physical and assign empty slot
                        bionetApi.get(virtualId, function (err, newVirtual) {
                            if (err) {
                                cb(err)
                                return
                            }
                            var name = newVirtual.name + '_0'
                            var x = 1
                            var y = 1
                            if (emptyCells && emptyCells[instance]) {
                                var cell = emptyCells[instance]
                                x = cell.parent_x
                                y = cell.parent_y
                            } else {
                                x = instance + 1
                            }
                            instance++
                            //todo: get color from dataset, default to lightgrey
                            var color = 'lightgray'
                            var physical = {
                                name: name,
                                type: 'physical',
                                virtual_id: virtualId,
                                parent_id: container.id,
                                parent_x: x,
                                parent_y: y,
                                color: color
                            }

                            bionetApi.savePhysical(physical, null, null, function (err, id) {
                                if (err) {
                                    cb(err)
                                    return
                                }
                                bionetApi.get(id, function (err, newPhysical) {
                                    if (err) {
                                        cb(err)
                                        return
                                    }
                                    physicals.push(newPhysical)
                                    if (--nrem <= 0) {
                                        cb(null, physicals)
                                        /*
                                        // dump physicals to output file
                                        if (export_file) {
                                            const obj2array = function (obj) {
                                                var result = []
                                                result.push(obj.name)
                                                result.push(obj.id)
                                                result.push(obj.virtual_id)
                                                result.push(obj.parent_id)
                                                result.push(obj.parent_x)
                                                result.push(obj.parent_y)
                                                return result
                                            }
                                            exportDataset(physicals, export_file, export_format, obj2array, function (err) {
                                                process.exit()
                                            })
                                        } else {
                                            process.exit()
                                        }
                                            */
                                    }
                                })
                            })
                        })
                    });
                }
            }
        })
    }
}

