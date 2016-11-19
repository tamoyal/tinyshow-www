class EventsFetchedAt < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :events_fetched_at, :datetime
    add_column :user_facebook_pages, :events_fetched_at, :datetime
  end
end
