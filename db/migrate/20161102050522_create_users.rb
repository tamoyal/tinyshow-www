class CreateUsers < ActiveRecord::Migration[5.0]
  def change
		create_table :users do |t|
			t.string :first_name
			t.string :last_name
			t.string :email
			t.string :phone
			t.string :facebook_id
			t.string :facebook_access_token
      t.datetime :facebook_access_token_expiration
			t.string :facebook_graph_payload
      t.datetime :confirmed_at
			t.boolean :get_events_from_user_fb_account
			t.timestamps
		end
    add_index :users, :email, unique: true, where: "(confirmed_at IS NOT NULL)"
    add_index :users, :facebook_id, unique: true
  end
end
