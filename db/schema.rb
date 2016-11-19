# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161119214948) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "facebook_events", force: :cascade do |t|
    t.string   "facebook_id"
    t.string   "owner_facebook_id"
    t.string   "graph_payload"
    t.datetime "starts_at"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["facebook_id", "owner_facebook_id"], name: "index_facebook_events_on_facebook_id_and_owner_facebook_id", unique: true, using: :btree
  end

  create_table "user_facebook_pages", force: :cascade do |t|
    t.string   "facebook_id"
    t.string   "facebook_access_token"
    t.string   "graph_payload"
    t.datetime "deactivated_at"
    t.integer  "user_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.datetime "events_fetched_at"
    t.index ["user_id", "facebook_id"], name: "index_user_facebook_pages_on_user_id_and_facebook_id", unique: true, using: :btree
    t.index ["user_id"], name: "index_user_facebook_pages_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "phone"
    t.string   "facebook_id"
    t.string   "facebook_access_token"
    t.datetime "facebook_access_token_expiration"
    t.string   "facebook_graph_payload"
    t.datetime "confirmed_at"
    t.boolean  "get_events_from_user_fb_account"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.datetime "events_fetched_at"
    t.index ["email"], name: "index_users_on_email", unique: true, where: "(confirmed_at IS NOT NULL)", using: :btree
    t.index ["facebook_id"], name: "index_users_on_facebook_id", unique: true, using: :btree
  end

  add_foreign_key "user_facebook_pages", "users"
end
