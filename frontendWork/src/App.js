import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssignCourse from './scenes/Assign';
import CourseList from './scenes/Courses';
import FacultyList from './scenes/Faculty';
import Home from './scenes/Home';
import Schedules from './scenes/Schedules';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/assign' element={<AssignCourse />} />
                    <Route path='/courses' element={<CourseList />} />
                    <Route path='/schedules' element={<Schedules />} />
                    <Route path='/faculty-members' element={<FacultyList />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
