<!-- If Redis didn't exist, how would I solve this? -->

- store user 
- no of request coming (inc_r) 
- with each incoming request we'll check against inc_r
{user123:7,time:5}
- we'll have to make sure every min the count is invalidated (having a ttl to every entry)

1 - 10am
user1:1
2- 10:00:12
user1:2
----------> at 10:01 invalidate(user1:0)
3- 10:01:01
user1:1