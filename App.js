Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    defaultCardboardConfig:{
        xtype:'rallycardboard',
        listeners:{},
        storeConfig:{
            filters:[]
        }
    },
    swimlaneAttribute:'KanbanState',
    model:'story',

    launch: function() {
        Rally.data.ModelFactory.getModel({
            type: this.model,
            success: this.getSwimlaneValues,
            scope:this
        });
    },
    getSwimlaneValues:function(model) {
        var field = model.getField(this.swimlaneAttribute);
        Ext.Array.each(field.allowedValues, function(value, index) {
            this.addRow(field.name, value.StringValue, index);
        }, this);
    },

    addRow:function(field, value, destroyHeader) {
        var plus = value + " +";
        var minus = value + " -";
        var button = {
            xtype:"rallybutton",
            text: minus,
            handler: function(button) {
                var card = this.up('.container').down('#cardboard');
                if (minus == button.getText()) {
                    card.setVisible(false);
                    button.setText(plus);
                }
                else {
                    button.setText(minus);
                    card.setVisible(true);
                }
            }
        };
        var cardboardConfig = Ext.clone(this.defaultCardboardConfig);
        var row = {
            items:[button,cardboardConfig]

        };

        cardboardConfig.itemId = 'cardboard';
        var query = Ext.create('Rally.data.QueryFilter', {
            property: field,
            value: value
        });
        cardboardConfig.storeConfig.filters.push(query);
        if (destroyHeader) {
            cardboardConfig.listeners.load = function(cardboard) {
                Ext.each(cardboard.getColumns(), function(column) {
                    column.down('#columnHeader').setVisible(false);
                });
            };
        }
        this.add(row);
    }
});
