$(function () {

    var Country = Backbone.Model.extend();

    var CountriesList = Backbone.Collection.extend({
        model: Country,
        // URL to fetch collection data
        url: 'https://gist.githubusercontent.com/michaelfbradley/ced357ae693110f2d9343b85ac99d61d/raw/009a47f72b2d45ffe9e3a7a6cea4e2b0e1e1299a/athletic_medalists.json',
        // Sorts collection by medal_count descending
        comparator: function (model) {
            return -model.get('medal_count');
        },

        parse: function (response) {
            // Groups medals by country
            var groups = _.groupBy(response, function (value) {
                return value.country;
            });

            return _.map(groups, function (group) {
                var scores = {};
                // Get array of all the countries medals
                var medals = _.pluck(group, 'medal');
                // Builds a count for all medal types
                medals.forEach(function (x) {
                    scores[x] = (scores[x] || 0) + 1;
                });

                return {
                    country: group[0].country,
                    gold_count: scores['Gold'] || 0,
                    silver_count: scores['Silver'] || 0,
                    bronze_count: scores['Bronze'] || 0,
                    medal_count: medals.length
                }
            });

        }
    });

    var ItemView = Backbone.View.extend({
        // Wrapper type
        tagName: 'tr',
        // Wrapper class
        className: 'info',
        template: _.template($('#itemTemplate').html()),

        render: function () {
            this.$el.html(this.template({item: this.model.toJSON()}));
            return this;
        }
    });

    var ListView = Backbone.View.extend({
        // Target parent
        el: "#league",

        render: function () {
            var self = this;

            // Fetch collection and populate rows
            this.collection.fetch({
                success: function () {
                    self.collection.each(function (list) {
                        var item = new ItemView({model: list});
                        self.$el.append(item.render().el);
                    });
                },
                error: function () {
                    console.log('Failed to fetch!');
                }
            });

            return this;
        }
    });

    var countries = new CountriesList();
    var profilesView = new ListView({collection: countries});

    profilesView.render();
});