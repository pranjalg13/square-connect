from fastapi import FastAPI, HTTPException
import requests

app = FastAPI()

posts = [
    {'id': 1, 'title': 'Store Update', 'content': 'We have new inventory in stock!', 'type': 'update'},
    {'id': 2, 'title': '50% Off Sale', 'content': 'All items are 50% off this weekend!', 'type': 'promotion'},
    {'id': 3, 'title': 'Community Event', 'content': 'Join us for a local cooking class next Saturday!', 'type': 'event'},
]

@app.get('/api/posts')
def get_posts():
    return posts

@app.post('/api/posts')
def create_post(title: str, content: str, type: str):
    new_post = {'id': len(posts) + 1, 'title': title, 'content': content, 'type': type}
    posts.append(new_post)
    return new_post

@app.post('/api/transactions/{event_id}')
def create_transaction(event_id: int):
    event = next((p for p in posts if p['id'] == event_id and p['type'] == 'event'), None)
    if not event:
        raise HTTPException(status_code=404, detail='Event not found')

    response = requests.post(
        'https://connect.squareup.com/v2/checkout',
        json={
            'amount': 25,
            'currency': 'USD',
            'customer_email': 'customer@example.com',
        },
        headers={
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        },
    )
    return {'checkoutUrl': response.json()['checkout_page_url']}

if __name__ == '__main__':
    app.run(debug=True)