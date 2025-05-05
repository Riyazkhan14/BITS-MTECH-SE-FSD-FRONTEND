## Local Setup Instructions

This section details how to set up the project for local development and testing without relying on PythonAnywhere or Netlify.

### Frontend (React + Vite + Tailwind)

```sh
# Clone the Backend Repository
git clone https://github.com/your-username/school-vax-portal.git
cd school-vax-portal/backend

# Create and Activate a Virtual Environment
python -m venv venv
source venv/bin/activate  

# On Windows:
venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Create a Superuser (Optional)
python manage.py createsuperuser

# Run the Development Server
python manage.py runserver

# Navigate to Frontend Directory
cd ../BITS-MTECH-SE-FSD-FRONTEND

# Clone the Frontend Repository
git clone git@github.com:Riyazkhan14/BITS-MTECH-SE-FSD-FRONTEND.git
cd BITS-MTECH-SE-FSD-FRONTEND

# Install Node Dependencies
npm install

# Configure Environment Variables
Create a .env file in the root of /frontend using .env.example as a reference.
VITE_BACKEND_URL=http://127.0.0.1:8000/

# Start the Frontend Development Server
npm run dev
