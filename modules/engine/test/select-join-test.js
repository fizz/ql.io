/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _    = require('underscore');

var Engine = require('../lib/engine'),
    util = require('util');

var cooked = {
    joinselectandalias : {
            ports: [
                {
                    port: 3000,
                    status: 200,
                    type: "application",
                    subType: "json",
                    payload:JSON.stringify(
                        [
                            {   "ProductID" :"99998176",
                                "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                                "Title" : "Apple iPhone 4 - 16GB - Black (AT&T) Smartphone (MC318LL/A)"
                            },
                            {   "ProductID" :"101892398",
                                "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                                "Title" : "Apple iPhone 3G - 8GB - Black (AT&T) Smartphone"
                            },
                            {   "ProductID" :"101828989",
                                "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                                "Title" : "Apple iPhone 3GS - 16GB - Black (AT&T) Smartphone"
                            },
                            {   "ProductID" :"100012593",
                                "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                                "Title" : "Apple iPhone 3GS - 8GB - Black (AT&T) Smartphone"
                            },
                            {   "ProductID" :"101787954",
                                "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                                "Title" : "Apple iPhone 4 - 16GB - Black (Verizon) Smartphone"
                            }
                        ]
                    )
                },
                {
                    port: 3026,
                    status:200,
                    type: "application",
                    subType: "json",
                    payload: JSON.stringify(
                        [
                            {
                                "productID":"99998176",
                                "inventoryCountResponse":{"totalCount":"1765" }
                            },
                            {
                                "productID":"101892398",
                                "inventoryCountResponse":{"totalCount":"1196" }
                            },
                            {
                                "productID":"101828989",
                                "inventoryCountResponse":{"totalCount":"877" }
                            },
                            {
                                "productID":"100012593",
                                "inventoryCountResponse":{"totalCount":"1456" }
                            },
                            {
                                "productID":"101787954",
                                "inventoryCountResponse":{"totalCount":"900" }
                            }
                        ]
                    )
                }
            ],
            script: 'create table first on select get from "http://localhost:3000"'+
                    'create table second on select get from "http://localhost:3026";'+
                    'products = select * from first ;'+
                    'prodstats = select * from second where productID in ("{products.ProductID}"); '+
                    'joined = select p.StockPhotoURL as url, ps.productID as id, ps.inventoryCountResponse as count from products as p, prodstats as ps where ps.productID = p.ProductID;'+
                    'return {\
                        "p": "{products.ProductID}",\
                        "s": "{prodstats.productID}",\
                        "j": "{joined}",\
                        "jid": "{joined.id}"\
                    }',

            udf: {
                test : function (test, err, result) {
                    if(err) {
                        console.log(err.stack || err);
                    }
                    else {
                        test.ok(result.body);
                        test.ok(result.body.p);
                        test.ok(result.body.s);
                        var count = 0;
                        _.each(result.body.p, function(id) {
                            test.equal(id, result.body.s[count]);
                            test.equal(id, result.body.j[count].id);
                            test.equal(id, result.body.jid[count]);
                         count++;
                        })
                        var count1 = 0;
                        _.each(result.body.j, function(id) {
                            test.equal(id, result.body.j[count1]);
                            count1++;
                        })
                    }
                }
            }
        },
    selectjoinremovalfromboth:{
        ports: [
            {
                port: 3000,
                status: 200,
                type: "application",
                subType: "json",
                payload:JSON.stringify(
                    [
                        {   "ProductID" :"99998176",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 4 - 16GB - Black (AT&T) Smartphone (MC318LL/A)"
                        },
                        {   "ProductID" :"101892398",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3G - 8GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"101828989",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3GS - 16GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"100012593",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3GS - 8GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"101787954",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 4 - 16GB - Black (Verizon) Smartphone"
                        }
                    ]
                )
            },
            {
                port: 3026,
                status:200,
                type: "application",
                subType: "json",
                payload: JSON.stringify(
                    [
                        {
                            "productID":"99998176",
                            "inventoryCountResponse":{"totalCount":"1765" }
                        },
                        {
                            "productID":"101892398",
                            "inventoryCountResponse":{"totalCount":"1196" }
                        },
                        {
                            "productID":"101828989",
                            "inventoryCountResponse":{"totalCount":"877" }
                        },
                        {
                            "productID":"100012593",
                            "inventoryCountResponse":{"totalCount":"1456" }
                        },
                        {
                            "productID":"101787954",
                            "inventoryCountResponse":{"totalCount":"900" }
                        }
                    ]
                )
            }
        ],
        script: 'create table first on select get from "http://localhost:3000"'+
            'create table second on select get from "http://localhost:3026";'+
            'products = select * from first ;'+
            'prodstats = select * from second where productID in ("{products.ProductID}"); '+
            'return select p.StockPhotoURL, p.Title, ps.productID, ps.inventoryCountResponse from products as p, prodstats as ps where ps.productID = p.ProductID;',

        udf: {
            test : function (test, err, result) {
                if(err) {
                    test.ok(false, err);
                }
                else {
                    test.ok(result.body);
                    test.ok(result.body[0]);
                    test.equal(result.body[0].length, 4);
                }
            }
        }
    },
    selectjoinremovalfrommain : {
        ports: [
            {
                port: 3000,
                status: 200,
                type: "application",
                subType: "json",
                payload:JSON.stringify(
                    [
                        {   "ProductID" :"99998176",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 4 - 16GB - Black (AT&T) Smartphone (MC318LL/A)"
                        },
                        {   "ProductID" :"101892398",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3G - 8GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"101828989",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3GS - 16GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"100012593",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqJ,!lwE65n1q-zjBO5dLYuRFg~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 3GS - 8GB - Black (AT&T) Smartphone"
                        },
                        {   "ProductID" :"101787954",
                            "StockPhotoURL":"http://i.ebayimg.com/00/$(KGrHqR,!loE8EW+5STkBPRL6QZRh!~~_6.JPG?set_id=89040003C1",
                            "Title" : "Apple iPhone 4 - 16GB - Black (Verizon) Smartphone"
                        }
                    ]
                )
            },
            {
                port: 3026,
                status:200,
                type: "application",
                subType: "json",
                payload: JSON.stringify(
                    [
                        {
                            "productID":"99998176",
                            "inventoryCountResponse":{"totalCount":"1765" }
                        },
                        {
                            "productID":"101892398",
                            "inventoryCountResponse":{"totalCount":"1196" }
                        },
                        {
                            "productID":"101828989",
                            "inventoryCountResponse":{"totalCount":"877" }
                        },
                        {
                            "productID":"100012593",
                            "inventoryCountResponse":{"totalCount":"1456" }
                        },
                        {
                            "productID":"101787954",
                            "inventoryCountResponse":{"totalCount":"900" }
                        }
                    ]
                )
            }
        ],
        script: 'create table first on select get from "http://localhost:3000"'+
            'create table second on select get from "http://localhost:3026";'+
            'products = select * from first ;'+
            'prodstats = select * from second where productID in ("{products.ProductID}"); '+
            'return select p.ProductID, p.StockPhotoURL, p.Title, ps.productID, ps.inventoryCountResponse from products as p, prodstats as ps where ps.productID = p.ProductID;',

        udf: {
            test : function (test, err, result) {
                if(err) {
                    test.ok(false, err);
                }
                else {
                    test.ok(result.body);
                    test.ok(result.body[0]);
                    test.equal(result.body[0].length, 5);
                }
            }
        }

    }

}

module.exports = require('ql-unit').init({
    cooked: cooked,
    engine:new Engine({

    })
});