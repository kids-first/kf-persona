import mongoose from 'mongoose';
import striptags from 'striptags';

mongoose.Promise = global.Promise;

// @ts-expect-error since we change prototype, typescript is no able to handle it.
mongoose.Schema.Types.String.prototype.stripHtmlTags = function () {
    return this.set(function (v, self) {
        if ('string' != typeof v) v = self.cast(v);
        if (v) return striptags(v);
        return v;
    });
};

export default mongoose;
