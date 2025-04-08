#include <cassert>  // assert
#include <iostream> // cout, endl, istream, ostream
#include <sstream>  // istringstream, ostringstream

using namespace std;

#define TEST5
#define TEST6
#define TEST7
#define TEST8
// #define TEST9
// #define TEST10

class AbstractShape {
    friend bool operator == (const AbstractShape& lhs, const AbstractShape& rhs) {
        return lhs.equals(rhs);}

    friend bool operator != (const AbstractShape& lhs, const AbstractShape& rhs) {
        return !(lhs == rhs);}

    friend istream& operator >> (istream& lhs, AbstractShape& rhs) {
        return rhs.read(lhs);}

    friend ostream& operator << (ostream& lhs, const AbstractShape& rhs) {
        return rhs.write(lhs);}

    private:
        int _x;
        int _y;

    protected:
        AbstractShape& operator = (const AbstractShape&) = default;

        virtual bool equals (const AbstractShape& rhs) const {
            return (_x == rhs._x) && (_y == rhs._y);}

        virtual istream& read (istream& in) {
            return in >> _x >> _y;}

        virtual ostream& write (ostream& out) const {
            return out << _x << " " << _y;}

    public:
        AbstractShape (int x, int y) :
                _x (x),
                _y (y)
            {}

        AbstractShape          (const AbstractShape&) = default;
        virtual ~AbstractShape ()                     = default;

        virtual double area () const {
            return 0;}

        void move (int x, int y) {
            _x = x;
            _y = y;}};

class Circle : public AbstractShape {
    private:
        int _r;

    protected:
        bool equals (const AbstractShape& rhs) const override {
            const Circle* const p = dynamic_cast<const Circle*>(&rhs);
            return p && AbstractShape::equals(rhs) && (_r == p->_r);}

        istream& read (istream& in) override {
            return AbstractShape::read(in) >> _r;}

        ostream& write (ostream& out) const override {
            return AbstractShape::write(out) << " " << _r;}

    public:
        Circle (int x, int y, int r) :
                AbstractShape (x, y),
                _r    (r)
            {}

        Circle             (const Circle&) = default;
        ~Circle            ()              = default;
        Circle& operator = (const Circle&) = default;

        double area () const override {
            return 3.14 * _r * _r;}

        int radius () const {
            return _r;}};

#ifdef TEST5
void test5 () {
    Circle x(2, 3, 4);
    x.move(5, 6);
    assert(x.area()   == 3.14 * 4 * 4);
    assert(x.radius() == 4);}
#endif

#ifdef TEST6
void test6 () {
    const Circle x(2, 3, 4);
          Circle y(2, 3, 5);
    assert(x != y);
    y = x;
    assert(x == y);}
#endif

#ifdef TEST7
void test7 () {
    istringstream sin("4 5 6");
    Circle x(2, 3, 4);
    Circle y(4, 5, 6);
    sin >> x;
    assert(x == y);}
#endif

#ifdef TEST8
void test8 () {
    ostringstream sout;
    Circle x(2, 3, 4);
    sout << x;
    assert(sout.str() == "2 3 4");}
#endif

#ifdef TEST9
void test9 () {
//  Circle*        const p = new AbstractShape(2, 3); // doesn't compile
    AbstractShape* const p = new Circle(2, 3, 4);
    p->move(5, 6);
    assert(p->area() == 3.14 * 4 * 4);
//  p->radius();                                      // doesn't compile
    if (Circle* const q = dynamic_cast<Circle*>(p))
        assert(q->radius() == 4);
    try {
        Circle& r = dynamic_cast<Circle&>(*p);
        assert(r.radius() == 4);}
    catch (const bad_cast& e) {
        assert(false);}
    delete p;}
#endif

#ifdef TEST10
void test10 () {
    const AbstractShape* const p = new Circle(2, 3, 4);
    const AbstractShape*       q = new Circle(2, 3, 5);
    assert(*p != *q);
//  *q = *p;                                            // error: no viable overloaded '='
    delete q;
    q = p->clone();
    assert(*p == *q);
    delete p;
    delete q;}
#endif

int main () {
    cout << "Shapes.cpp" << endl;
    int n;
    cin >> n;
    switch (n) {
        #ifdef TEST5
        case 5:
            test5();
            break;
        #endif

        #ifdef TEST6
        case 6:
            test6();
            break;
        #endif

        #ifdef TEST7
        case 7:
            test7();
            break;
        #endif

        #ifdef TEST8
        case 8:
            test8();
            break;
        #endif

        #ifdef TEST9
        case 9:
            test9();
            break;
        #endif

        #ifdef TEST10
        case 10:
            test10();
            break;
        #endif

        default:
            assert(false);}
    cout << "Done." << endl;
    return 0;}
