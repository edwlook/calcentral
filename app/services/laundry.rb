require 'nokogiri'
require 'open-uri'

url = "http://localhost:4567/interesting.html"

data = Nokogiri::HTML(open(url))
