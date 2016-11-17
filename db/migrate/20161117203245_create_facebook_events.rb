class CreateFacebookEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :facebook_events do |t|
      t.string :facebook_id
      t.string :owner_facebook_id
      t.string :graph_payload
      t.datetime :starts_at
      t.timestamps
    end
    add_index :facebook_events, [:facebook_id, :owner_facebook_id], unique: true
  end
end
